import React, { Suspense } from 'react';
import { type NextPage } from 'next';

import ArticleContent from './ArticleContent';
import Footer from '@/app/atoms/footer';
import Header from '@/app/atoms/header';

interface Props {
  params: { slug: string };
}

const ArticlePage: NextPage<Props> = async ({ params }: Props): Promise<React.ReactElement> => {
  const { slug } = params;

  return (
    <div className="text-gray-900 bg-gray-100 dark:bg-slate-900 dark:text-slate-30">
      <Header />
      <Suspense fallback={<span className="loading loading-dots loading-lg absolute inset-x-[50%] inset-y-[60%]" />}>
        <ArticleContent slug={slug} />
      </Suspense>
      <Footer />
    </div>
  );
};

export default ArticlePage;
