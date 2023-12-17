import React from 'react';
import { NextPage } from 'next';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMarkdownData } from '../../lib/markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

/*
 * import languages for syntax highlighting.
 * ref: https://biplobsd.me/blogs/view/syntax-highlight-code-in-NextJS-tailwindcss-daisyui.md
 * ref: https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_PRISM.MD
 */
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import lua from 'react-syntax-highlighter/dist/cjs/languages/prism/lua';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('lua', lua);

interface Props {
  params: { slug: string };
}

const ArticlePage: NextPage<Props> = async ({ params }: Props) => {
  const { slug } = params;
  const pathToContent = path.join(process.cwd(), 'doc', 'articles', `${slug}.md`);
  const content = await getMarkdownData(pathToContent);

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="markdown"
        components={{
          // @ts-ignore
          code({ inline, className, ...props }) {
            const hasLang = /language-(\w+)/.exec(className || '');
            return !inline && hasLang ? (
              <SyntaxHighlighter
                style={oneDark}
                language={hasLang[1]}
                PreTag="div"
                className="mockup-code scrollbar-thin scrollbar-track-base-content/5 scrollbar-thumb-base-content/40 scrollbar-track-rounded-md scrollbar-thumb-rounded m-0"
                showLineNumbers={true}
                useInlineStyles={true}
              >
                {String(props.children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </>
  );
};

export default ArticlePage;
