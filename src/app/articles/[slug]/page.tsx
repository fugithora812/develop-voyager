import React from 'react';
import { HiLink } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import lua from 'react-syntax-highlighter/dist/cjs/languages/prism/lua';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { type NextPage } from 'next';
import path from 'path';
import remarkGfm from 'remark-gfm';

import { getMarkdownData } from '../../lib/markdown';

/* end of import languages for syntax highlighting */
import Footer from '@/app/atoms/footer';
import Header from '@/app/atoms/header';
import fetchArticleMetadata, { type ArticleMetadata } from '@/app/lib/fetchArticleMetadata';

/*
 * setting languages for syntax highlighting.
 * ref: https://biplobsd.me/blogs/view/syntax-highlight-code-in-NextJS-tailwindcss-daisyui.md
 * ref: https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_PRISM.MD
 */
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('lua', lua);

const customH2 = ({ ...props }): React.ReactElement => {
  return (
    <li>
      <a
        href={`#${props.children}`}
        className="inline-flex items-center py-1 text-base text-gray-900 duration-300 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-300 md:text-lg"
      >
        <HiLink className="mr-2" />
        {props.children}
      </a>
    </li>
  );
};

const components = { h2: customH2 };

interface Props {
  params: { slug: string };
}

const ArticlePage: NextPage<Props> = async ({ params }: Props): Promise<React.ReactElement> => {
  const { slug } = params;
  const pathToContent = path.join(process.cwd(), 'doc', 'articles', `${slug}.md`);
  const content = await getMarkdownData(pathToContent);

  const metadata = await fetchArticleMetadata();
  const article = metadata.articles.find((article: ArticleMetadata) => article.href === `/articles/${slug}`);
  const imageUrl = article?.imageUrl;

  return (
    <div className="text-gray-900 bg-gray-100 dark:bg-slate-900 dark:text-slate-300">
      <Header />
      <div>
        <div className="h-10 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
          {/* eslint-disable-next-line */}
          <img
            src={imageUrl}
            loading="lazy"
            alt="Photo by Martin Sanchez"
            className="h-60 w-full object-cover object-center"
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[20%_60%] lg:gap-12">
        <ol className="p-2 md:p-4 ml-2 md:col-start-1">
          <h2 className="underline sticky top-16 max-[1010px]:hidden">🖌️ Table of Contents</h2>
          <h2 className="underline sticky top-16 min-[1010px]:hidden">🖌️ TOC</h2>
          <ReactMarkdown
            className="md:prose-md dark:prose-invert col-start-1 sticky top-[88px]"
            allowedElements={['h2']}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </ol>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="markdown col-start-2"
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
      </div>

      <Footer />
    </div>
  );
};

export default ArticlePage;
