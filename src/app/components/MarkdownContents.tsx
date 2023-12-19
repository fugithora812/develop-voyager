import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import lua from 'react-syntax-highlighter/dist/cjs/languages/prism/lua';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { type NextPage } from 'next';
import remarkGfm from 'remark-gfm';

/*
 * setting languages for syntax highlighting.
 * ref: https://biplobsd.me/blogs/view/syntax-highlight-code-in-NextJS-tailwindcss-daisyui.md
 * ref: https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_PRISM.MD
 */
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('lua', lua);

interface Props {
  content: string;
  children?: React.ReactNode;
}

const MarkdownContents: NextPage<Props> = ({ content }: Props): React.ReactElement => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="markdown"
      components={{
        // @ts-expect-error eslint-disable-this-line
        code({ inline, className, ...props }) {
          // eslint-disable-next-line
          const hasLang = /language-(\w+)/.exec(className || '');
          // eslint-disable-next-line
          return !inline && hasLang ? (
            <SyntaxHighlighter
              style={oneDark}
              language={hasLang[1]}
              PreTag="div"
              className="mockup-code scrollbar-thin scrollbar-track-base-content/5 scrollbar-thumb-base-content/40 scrollbar-track-rounded-md scrollbar-thumb-rounded m-0"
              showLineNumbers
              useInlineStyles
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
  );
};

export default MarkdownContents;
