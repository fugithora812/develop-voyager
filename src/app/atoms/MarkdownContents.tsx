import React from 'react';
import { HiLink } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import diff from 'react-syntax-highlighter/dist/cjs/languages/prism/diff';
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
SyntaxHighlighter.registerLanguage('diff', diff);

const customH2 = ({ ...props }): React.ReactElement => {
  return (
    <li>
      <a
        href={`#${props.children}`}
        className="inline-flex items-center py-1 text-sm sm:text-base text-gray-900 duration-300 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-300 lg:text-lg"
      >
        <HiLink className="mr-1 sm:mr-2 flex-shrink-0" />
        <span className="truncate">
          {typeof props.children === 'string'
            ? abbreviateString(props.children, { type: 'articleShortToc' })
            : props.children}
        </span>
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
        <ReactMarkdown className="md:prose-md dark:prose-invert" allowedElements={['h2']} components={components}>
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
              const lang = /language-(\w+)/.exec(className || '');

              if (lang === null) return;
              const addRowNumbers: number[] = [];
              const deleteRowNumbers: number[] = [];
              let code = '';
              const codeRows = String(props.children ?? '').split(/\n/);
              const excludedPrefixCodeRows = codeRows.map((codeRow, index) => {
                if (/^\+.*$/.test(codeRow)) {
                  addRowNumbers.push(index + 1);
                  return codeRow.slice(2);
                } else if (/^-.*$/.test(codeRow)) {
                  deleteRowNumbers.push(index + 1);
                  return codeRow.slice(2);
                }
                return codeRow;
              });
              code = excludedPrefixCodeRows.join('\n');

              const [, filename] = lang.input.split(':');
              let customStyle = {};
              if (typeof filename !== 'undefined') {
                customStyle = {
                  marginTop: '0px',
                  borderTopLeftRadius: '0px',
                };
              } else {
                customStyle = {
                  marginTop: '0px',
                };
              }
              // eslint-disable-next-line
              return !inline && lang !== null ? (
                <>
                  {typeof filename !== 'undefined' && (
                    <div>
                      <span className="bg-slate-300 text-gray-800 dark:bg-gray-800 dark:text-slate-300 px-2 py-[2.5px] rounded-t-lg mb-0">
                        {filename}
                      </span>
                    </div>
                  )}
                  <SyntaxHighlighter
                    style={oneDark}
                    language={lang[1]}
                    showLineNumbers
                    useInlineStyles
                    wrapLines
                    customStyle={customStyle}
                    lineNumberStyle={{ display: 'none', padding: '-10px' }}
                    lineProps={(lineNumber: number) => {
                      const style: { display: string; backgroundColor?: string } = { display: 'block' };
                      if (addRowNumbers.includes(lineNumber)) {
                        style.backgroundColor = '#00921b33';
                      } else if (deleteRowNumbers.includes(lineNumber)) {
                        style.backgroundColor = '#da363233';
                      }
                      return { style };
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </>
              ) : (
                <code className={className} {...props} />
              );
            },
            h2({ ...props }) {
              return (
                <h2 id={String(props.children ?? '').replace(/\n$/, '')} className="z-50 bg-gray-100 dark:bg-slate-900 group">
                  <a
                    href={`#${String(props.children ?? '').replace(/\n$/, '')}`}
                    className="inline-flex items-center py-1 text-base text-gray-900 duration-300 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-300 opacity-0 group-hover:opacity-100 ml-[-25px]"
                  >
                    <HiLink className="mr-2" />
                  </a>
                  {props.children}
                </h2>
              );
            },
            blockquote({ ...props }) {
              const { children } = props;
              if (children === null) return;
              if (typeof children === 'undefined') return;
              const citeStyle = 'block text-[#737373] text-[1em] text-right mt-2 font-semibold';

              // @ts-expect-error eslint-disable-this-line
              if (typeof children[1].props.children === 'string') {
                // @ts-expect-error eslint-disable-this-line
                const [quote, cite] = children[1].props.children.split(/\nfrom: /);
                return (
                  <blockquote>
                    <p>{quote}</p>
                    <cite className={citeStyle}>出典：{cite}</cite>
                  </blockquote>
                );
              }
              // @ts-expect-error eslint-disable-this-line
              const [quote] = children[1].props.children[0].split(/\nfrom: /);
              // @ts-expect-error eslint-disable-this-line
              const { href, children: cite } = children[1].props.children[1].props;
              return (
                <blockquote className="quote-003">
                  <p>{quote}</p>
                  <cite className={citeStyle}>
                    出典：
                    <a
                      href={href}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {cite}
                    </a>
                  </cite>
                </blockquote>
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
