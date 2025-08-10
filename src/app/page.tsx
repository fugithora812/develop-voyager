'use client';
/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Footer from './atoms/footer';
import Header from './atoms/header';
import { type ArticleMetadata, getAllArticles } from './lib/dynamoDbClient';
import isLatestArticle from './lib/isLatestArticle';

/**
 * ArticleCardコンポーネントの統合実装
 *
 * 【経緯】
 * - 元々 ./atoms/ArticleCard から import していた
 * - Vercelデプロイ時に "Module not found: Can't resolve './atoms/ArticleCard'" エラーが発生
 * - ローカルビルドでは成功するが、Vercel環境でのみ失敗する問題
 * - 絶対パス (@/app/atoms/ArticleCard) でも同様のエラーが発生
 * - モジュール解決問題を回避するため、コンポーネントを直接埋め込み
 *
 * 【元のファイル】src/app/atoms/ArticleCard.tsx の内容を統合
 * 【実装日】2025-08-09 スティッキーヘッダー機能実装時
 */
interface ArticleCardProps {
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  href: string;
  latest?: boolean;
}

const ArticleCard = ({
  imageUrl,
  category,
  title,
  description,
  href,
  latest,
}: ArticleCardProps): React.ReactElement => {
  return (
    <div
      className={`${latest === true ? 'w-full' : 'w-[49%]'}
  flex flex-col items-center my-6 space-y-4 md:space-x-4 md:space-y-0 md:flex-row relative`}
    >
      <div className="m-auto overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 w-full ">
        <Link href={href} className="w-inherit block h-full">
          {/* eslint-disable-next-line */}
          <img alt="blog photo" src={imageUrl} className="object-cover w-full h-40" />
          <div className="w-100 p-4 bg-white dark:bg-gray-800 break-words">
            <div className="flex items-start mb-3">
              <div className="badge badge-primary text-md">{category}</div>
              {latest === true && <div className="badge badge-secondary ml-1">Latest</div>}
            </div>
            <p className="truncate mb-2 text-xl font-medium text-gray-800 dark:text-white">{title}</p>
            <p className="truncate font-light text-gray-600 dark:text-gray-400 text-md ">{description}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

const Home = (): React.ReactElement => {
  const [articles, setArticles] = useState<ArticleMetadata[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleMetadata[]>([]);
  const [paginatedArticles, setPaginatedArticles] = useState<ArticleMetadata[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  // ページネーション関数
  const calculatePagination = (
    articles: ArticleMetadata[],
    page: number
  ): { paginatedArticles: ArticleMetadata[]; totalPages: number } => {
    if (articles.length === 0) {
      return { paginatedArticles: [], totalPages: 1 };
    }

    let startIndex: number;
    let endIndex: number;
    let totalPages: number;

    if (page === 1) {
      // 1ページ目は11件表示
      startIndex = 0;
      endIndex = 11;
      const remainingArticles = Math.max(0, articles.length - 11);
      totalPages = remainingArticles === 0 ? 1 : Math.ceil(remainingArticles / 10) + 1;
    } else {
      // 2ページ目以降は10件ずつ
      startIndex = 11 + (page - 2) * 10;
      endIndex = startIndex + 10;
      const remainingArticles = Math.max(0, articles.length - 11);
      totalPages = remainingArticles === 0 ? 1 : Math.ceil(remainingArticles / 10) + 1;
    }

    const paginatedArticles = articles.slice(startIndex, endIndex);

    return { paginatedArticles, totalPages };
  };

  useEffect(() => {
    const fetchArticles = async (): Promise<void> => {
      try {
        const fetchedArticles = await getAllArticles();
        fetchedArticles.sort((a: ArticleMetadata, b: ArticleMetadata) => {
          return a.createdAt < b.createdAt ? 1 : -1;
        });

        setArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);

        // カテゴリー一覧を取得
        const uniqueCategories = Array.from(new Set(fetchedArticles.map((article) => article.category)));
        setCategories(uniqueCategories);

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setIsLoading(false);
      }
    };

    void fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) => article.category === selectedCategory);
      setFilteredArticles(filtered);
    }
    // カテゴリー変更時はページを1にリセット
    setCurrentPage(1);
  }, [selectedCategory, articles]);

  // filteredArticlesまたはcurrentPageが変更されたときにページネーションを更新
  useEffect(() => {
    const { paginatedArticles, totalPages } = calculatePagination(filteredArticles, currentPage);
    setPaginatedArticles(paginatedArticles);
    setTotalPages(totalPages);
  }, [filteredArticles, currentPage]);

  const handleCategoryChange = (category: string): void => {
    setSelectedCategory(category);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="relative h-fit bg-gray-100 dark:bg-slate-900 dark:text-slate-300">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">Loading...</div>
          </div>
        </main>
      </>
    );
  }

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
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 rounded-r-full rounded-tl-sm rounded-bl-full text-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {selectedCategory === 'all' ? 'Select Category' : selectedCategory}
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
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                      <a
                        onClick={() => {
                          handleCategoryChange('all');
                        }}
                        className={selectedCategory === 'all' ? 'active' : ''}
                      >
                        All Categories
                      </a>
                    </li>
                    {categories.map((category) => (
                      <li key={category}>
                        <a
                          onClick={() => {
                            handleCategoryChange(category);
                          }}
                          className={selectedCategory === category ? 'active' : ''}
                        >
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCategory === 'all'
                    ? `Total: ${filteredArticles.length} articles (Page ${currentPage}/${totalPages})`
                    : `Filtered by "${selectedCategory}": ${filteredArticles.length} articles (Page ${currentPage}/${totalPages})`}
                </span>
              </div>
              <div className="flex flex-wrap items-center min-[1170px]:justify-between gap-1 mx-40">
                {paginatedArticles.map((article: ArticleMetadata) => (
                  <ArticleCard
                    key={article.href}
                    imageUrl={article.imageUrl}
                    category={article.category}
                    title={article.title}
                    description={article.description}
                    href={article.href}
                    latest={currentPage === 1 && isLatestArticle(article, filteredArticles)}
                  />
                ))}
              </div>
              {filteredArticles.length === 0 && (
                <div className="flex items-center justify-center mt-12">
                  <div className="text-center">
                    <p className="text-xl text-gray-600 dark:text-gray-400">該当する記事が見つかりませんでした</p>
                    <p className="text-md text-gray-500 dark:text-gray-500 mt-2">別のカテゴリーを選択してください</p>
                  </div>
                </div>
              )}

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="join">
                    <button
                      className={`join-item btn ${currentPage === 1 ? 'btn-disabled' : ''}`}
                      onClick={() => {
                        handlePageChange(currentPage - 1);
                      }}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      const isActive = page === currentPage;

                      return (
                        <button
                          key={page}
                          className={`join-item btn ${isActive ? 'btn-active' : ''}`}
                          onClick={() => {
                            handlePageChange(page);
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      className={`join-item btn ${currentPage === totalPages ? 'btn-disabled' : ''}`}
                      onClick={() => {
                        handlePageChange(currentPage + 1);
                      }}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
