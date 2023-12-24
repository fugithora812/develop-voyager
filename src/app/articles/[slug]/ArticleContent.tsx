import React from 'react';
import { type NextPage } from 'next';
import { redirect } from 'next/navigation';
import path from 'path';

import MarkdownContents from '@/app/atoms/MarkdownContents';
import { getArticleByPrimaryKey } from '@/app/lib/dynamoDbClient';
import { getMarkdownData } from '@/app/lib/markdown';

interface Props {
  slug: string;
}

const ArticleContent: NextPage<Props> = async ({ slug }: Props): Promise<React.ReactElement> => {
  const articleId = slug.slice(0, 4);
  const article = await getArticleByPrimaryKey(articleId, `/articles/${slug}`);
  const imageUrl = article?.imageUrl;
  const pathToContent = path.join(process.cwd(), 'doc', `${article?.href}.md`);
  let content;
  try {
    content = await getMarkdownData(pathToContent);
  } catch (error) {
    console.error(error);
    redirect('/404');
  }

  return (
    <>
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
          <h2 className="text-gray-800 dark:text-slate-300 underline sticky top-16 max-[1010px]:hidden">
            🖌️ Table of Contents
          </h2>
          <h2 className="text-gray-800 dark:text-slate-300 underline sticky top-16 min-[1010px]:hidden">🖌️ TOC</h2>
          <MarkdownContents content={content} isToc />
        </ol>
        <div className="col-start-2">
          <MarkdownContents content={content} />
        </div>
      </div>
    </>
  );
};

export default ArticleContent;
