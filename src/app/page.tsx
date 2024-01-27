import React from 'react';

import ArticleCard from './atoms/articleCard';
import Footer from './atoms/footer';
import Header from './atoms/header';
import { type ArticleMetadata, getAllArticles } from './lib/dynamoDbClient';
import isLatestArticle from './lib/isLatestArticle';

const Home = async (): Promise<React.ReactElement> => {
  const articles = await getAllArticles();
  articles.sort((a: ArticleMetadata, b: ArticleMetadata) => {
    return a.createdAt < b.createdAt ? 1 : -1;
  });

  return (
    <>
      <Header />
      <main className="relative h-fit bg-gray-100 dark:bg-slate-900 dark:text-slate-300">
        <div className="flex items-start justify-between">
          <div className="flex flex-col w-full min-[1170px]:space-y-4">
            <div className="h-fit px-4 pb-24 min-[1170px]:px-6">
              <h1 className="text-4xl font-semibold text-gray-800 dark:text-slate-300 text-center">
                Welcome To DevelopVoyager!
              </h1>
              <h2 className="text-gray-600 dark:text-gray-400 text-md text-center font-semibold">
                Here&#x27;s List of Articles
              </h2>
              <div className="flex items-center space-x-4 mx-40 mt-3">
                <div className="tooltip" data-tip="This is unavailable for now.">
                  <button
                    disabled
                    className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 rounded-r-full rounded-tl-sm rounded-bl-full text-md"
                  >
                    Select Category
                    <svg
                      width="20"
                      height="20"
                      className="ml-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"></path>
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Displayed All Articles Now.</span>
              </div>
              <div className="flex flex-wrap items-center min-[1170px]:justify-between gap-1 mx-40">
                {articles.map((article: ArticleMetadata) => (
                  <ArticleCard
                    key={article.href}
                    imageUrl={article.imageUrl}
                    category={article.category}
                    title={article.title}
                    description={article.description}
                    href={article.href}
                    latest={isLatestArticle(article, articles)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
