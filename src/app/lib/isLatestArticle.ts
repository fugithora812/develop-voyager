import { type ArticleMetadata } from './dynamoDbClient';

const isLatestArticle = (article: ArticleMetadata, articleList: ArticleMetadata[]): boolean => {
  const articleDates = articleList.map((a: ArticleMetadata) => new Date(a.createdAt));
  const mostRecentDate = articleDates.reduce((a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b));

  return new Date(article.createdAt).getTime() === mostRecentDate.getTime();
};

export default isLatestArticle;
