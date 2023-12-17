import fs from 'fs';

export const getMarkdownData = async (pathToContent: string): Promise<string> => {
  const markdown = await fs.promises.readFile(pathToContent, 'utf8');
  return markdown;
};
