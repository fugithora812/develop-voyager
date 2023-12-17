import fetchArticleMetadata, { ArticleMetadata } from './fetchArticleMetadata';

const isLatestArticle = (article: ArticleMetadata): boolean => {
  const metadata = fetchArticleMetadata();
  const articleDates = metadata.articles.map((a: ArticleMetadata) => new Date(a.date));
  const mostRecentDate = articleDates.reduce((a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b));

  return new Date(article.date).getTime() === mostRecentDate.getTime();
};

export default isLatestArticle;