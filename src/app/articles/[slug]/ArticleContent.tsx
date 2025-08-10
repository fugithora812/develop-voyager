import React from 'react';
import { type NextPage } from 'next';
import { redirect } from 'next/navigation';

import MarkdownContents from '@/app/atoms/MarkdownContents';
import { getArticleByPrimaryKey } from '@/app/lib/dynamoDbClient';
import { getObject } from '@/app/lib/s3Client';

interface Props {
  slug: string;
}

const ArticleContent: NextPage<Props> = async ({ slug }: Props): Promise<React.ReactElement> => {
  const articleId = slug.slice(0, 4);
  const article = await getArticleByPrimaryKey(articleId, `/articles/${slug}`);
  const imageUrl = article?.imageUrl;
  const data = await getObject('tech-blog-articles-storage', `articles/${slug}.md`);
  if (typeof data === 'undefined') {
    redirect('/404');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
          {/* eslint-disable-next-line */}
          <img
            src={imageUrl}
            loading="lazy"
            alt="Photo by Martin Sanchez"
            className="h-48 sm:h-64 md:h-80 w-full object-cover object-center"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] lg:gap-6 max-w-none">
        {/* 目次セクション - モバイルでは折りたたみ可能 */}
        <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4">
            <details className="lg:hidden" open>
              <summary className="cursor-pointer text-gray-800 dark:text-slate-300 font-semibold pb-2 list-none">
                🖌️ 目次 <span className="float-right">▼</span>
              </summary>
              <ol className="mt-2">
                <MarkdownContents content={data} isToc />
              </ol>
            </details>

            <div className="hidden lg:block">
              <h2 className="text-gray-800 dark:text-slate-300 underline pb-2 font-semibold">🖌️ 目次</h2>
              <ol>
                <MarkdownContents content={data} isToc />
              </ol>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="min-w-0 max-w-4xl">
          <MarkdownContents content={data} />
        </div>
      </div>
    </div>
  );
};

export default ArticleContent;
