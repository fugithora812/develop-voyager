import fs from 'fs';
import path from 'path';

interface ArticleMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  href: string;
  date: string;
}

const fetchArticleMetadata = async (): Promise<{ articles: ArticleMetadata[] }> => {
  const pathToMetadata = path.join(process.cwd(), 'doc', 'articleMetadata', 'metadata.json');
  const metadata = JSON.parse(await fs.promises.readFile(pathToMetadata, 'utf8'));

  return metadata;
};

const fetchArticleMetadataSync = (): { articles: ArticleMetadata[] } => {
  const pathToMetadata = path.join(process.cwd(), 'doc', 'articleMetadata', 'metadata.json');
  const metadata = JSON.parse(fs.readFileSync(pathToMetadata, 'utf8'));

  return metadata;
};

export default fetchArticleMetadata;
export type { ArticleMetadata };
export { fetchArticleMetadataSync };
