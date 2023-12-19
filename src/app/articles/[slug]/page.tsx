import React from 'react';
import { HiLink } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { type NextPage } from 'next';
import path from 'path';

import MarkdownContents from '../../components/MarkdownContents';
import { getMarkdownData } from '../../lib/markdown';

/* end of import languages for syntax highlighting */
import Footer from '@/app/atoms/footer';
import Header from '@/app/atoms/header';
import fetchArticleMetadata, { type ArticleMetadata } from '@/app/lib/fetchArticleMetadata';

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
        <div className="col-start-2">
          <MarkdownContents content={content} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticlePage;
