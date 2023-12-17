import React from 'react';

import Header from './atoms/header';
import Footer from './atoms/footer';
import ArticleCard from './atoms/articleCard';
import fetchArticleMetadata, { ArticleMetadata } from './lib/fetchArticleMetadata';
import isLatestArticle from './lib/isLatestArticle';

const Home = async () => {
  const metadata = fetchArticleMetadata();

  return (
    <>
      <Header />
      <main className="relative h-screen bg-gray-100 dark:bg-slate-900 dark:text-slate-300">
        <div className="flex items-start justify-between">
          <div className="flex flex-col w-full md:space-y-4">
            <div className="h-screen px-4 pb-24 md:px-6">
              <h1 className="text-4xl font-semibold text-gray-800 dark:text-white text-center">Welcome To TweetTech</h1>
              <h2 className="text-gray-400 text-md text-center">Here&#x27;s List of Articles</h2>
              <br />
              <div className="flex items-center space-x-4 mx-40">
                <button
                  disabled
                  className="flex items-center px-4 py-2 text-gray-400 border border-gray-300 rounded-r-full rounded-tl-sm rounded-bl-full text-md"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="mr-2 text-gray-400"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M192 1664h288v-288h-288v288zm352 0h320v-288h-320v288zm-352-352h288v-320h-288v320zm352 0h320v-320h-320v320zm-352-384h288v-288h-288v288zm736 736h320v-288h-320v288zm-384-736h320v-288h-320v288zm768 736h288v-288h-288v288zm-384-352h320v-320h-320v320zm-352-864v-288q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v288q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5zm736 864h288v-320h-288v320zm-384-384h320v-288h-320v288zm384 0h288v-288h-288v288zm32-480v-288q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v288q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5zm384-64v1280q0 52-38 90t-90 38h-1408q-52 0-90-38t-38-90v-1280q0-52 38-90t90-38h128v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h384v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h128q52 0 90 38t38 90z"></path>
                  </svg>
                  Select month
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
                <span className="text-sm text-gray-400">Displayed All Articles Now.</span>
              </div>
              <div className="flex flex-wrap items-center md:justify-between gap-1 mx-40">
                {metadata.articles.map((article: ArticleMetadata) => (
                  <ArticleCard
                    key={article.id}
                    imageUrl={article.imageUrl}
                    category={article.category}
                    title={article.title}
                    description={article.description}
                    href={article.href}
                    latest={isLatestArticle(article)}
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
