import path from 'path';
import fs from 'fs';

interface ArticleMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  href: string;
  date: string;
}

const fetchArticleMetadata = (): { articles: ArticleMetadata[] } => {
  const pathToMetadata = path.join(process.cwd(), 'doc', 'articleMetadata', 'metadata.json');
  const metadata = JSON.parse(fs.readFileSync(pathToMetadata, 'utf8'));

  return metadata;
};

export default fetchArticleMetadata;
export type { ArticleMetadata };
