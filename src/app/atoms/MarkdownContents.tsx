import React from 'react';
import { HiLink } from 'react-icons/hi';
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

import abbreviateString from '@/app/lib/abbreviateString';

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

const customH2 = ({ ...props }): React.ReactElement => {
  return (
    <li>
      <a
        href={`#${props.children}`}
        className="inline-flex items-center py-1 text-base text-gray-900 duration-300 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-300 md:text-lg max-[1130px]:hidden"
      >
        <HiLink className="mr-2" />
        {typeof props.children === 'string'
          ? abbreviateString(props.children, { type: 'articleLongToc' })
          : props.children}
      </a>
      <a
        href={`#${props.children}`}
        className="inline-flex items-center py-1 text-base text-gray-900 duration-300 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-300 md:text-lg min-[1130px]:hidden"
      >
        <HiLink className="mr-2" />
        {typeof props.children === 'string'
          ? abbreviateString(props.children, { type: 'articleShortToc' })
          : props.children}
      </a>
    </li>
  );
};

const components = { h2: customH2 };

interface Props {
  content: string;
  isToc?: boolean;
  children?: React.ReactNode;
}

const MarkdownContents: NextPage<Props> = async ({ content, isToc = false }: Props): Promise<React.ReactElement> => {
  return (
    <>
      {isToc && (
        <ReactMarkdown
          className="md:prose-md dark:prose-invert col-start-1 sticky top-[88px]"
          allowedElements={['h2']}
          components={components}
        >
          {content}
        </ReactMarkdown>
      )}
      {!isToc && (
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
            h2({ ...props }) {
              return (
                <h2
                  id={String(props.children).replace(/\n$/, '')}
                  className="z-50 bg-gray-100 dark:bg-slate-900 hover:bg-slate-700 group"
                >
                  <a
                    href={`#${String(props.children).replace(/\n$/, '')}`}
                    className="inline-flex items-center py-1 text-base text-gray-900 duration-300 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-300 opacity-0 group-hover:opacity-100 ml-[-25px]"
                  >
                    <HiLink className="mr-2" />
                  </a>
                  {props.children}
                </h2>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </>
  );
};

export default MarkdownContents;
