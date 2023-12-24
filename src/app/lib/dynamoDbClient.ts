'use server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

export interface ArticleMetadata {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  href: string;
  createdAt: string;
}

// const isDev = process.env.NODE_ENV === 'development';
const client = new DynamoDBClient({
  region: 'us-east-1',
  // credentials: isDev ? undefined : fromTemporaryCredentials({
  //   params: {
  //     RoleArn: '',
  //     RoleSessionName: 'nextjs-dynamodb-client',
  //     DurationSeconds: 3600,
  //   },
  //   clientConfig: { region: 'us-east-1' },
  // }),
});

export const getAllArticles = async (): Promise<ArticleMetadata[]> => {
  console.info('getAllArticles started.');
  const command = new ScanCommand({
    TableName: 'ArticlesMetadata',
  });
  // eslint-disable-next-line
  const response = await client.send(command);
  console.info('getAllArticles success:', response);

  if (typeof response.Items === 'undefined') {
    return [];
  }
  const articles = response.Items.map((item) => {
    return {
      id: Number(item.Id ?? 0),
      title: item.Title ?? '',
      description: item.Description ?? '',
      category: item.Category ?? '',
      imageUrl: item.ImageUrl ?? '',
      href: item.Href ?? '',
      createdAt: item.CreatedAt ?? '',
    };
  });
  return articles;
};

export const getArticleByPrimaryKey = async (articleId: string, href: string): Promise<ArticleMetadata | null> => {
  console.info('getArticleByPrimaryKey started. articleId:', articleId, 'href:', href);
  const command = new GetCommand({
    TableName: 'ArticlesMetadata',
    Key: {
      // Id: { N: idString },
      Id: Number(articleId),
      Href: href,
    },
  });
  // eslint-disable-next-line
  const response = await client.send(command);
  console.info('getArticleByPrimaryKey success:', response);

  if (typeof response.Item === 'undefined') {
    return null;
  }
  return {
    id: Number(response.Item.Id ?? 0),
    title: response.Item.Title ?? '',
    description: response.Item.Description ?? '',
    category: response.Item.Category ?? '',
    imageUrl: response.Item.ImageUrl ?? '',
    href: response.Item.Href ?? '',
    createdAt: response.Item.CreatedAt ?? '',
  };
};