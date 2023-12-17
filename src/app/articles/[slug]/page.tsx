import React from 'react';
import { NextPage } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMarkdownData } from '../../lib/markdown';

interface Props {
  params: { slug: string }
}

const ArticlePage: NextPage<Props> = async ({ params }: Props) => {
  const files = fs.readdirSync(path.join(process.cwd(), 'doc', 'articles'));
  const paths = files.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ''),
  }));
  const { slug } = params;
  const pathToContent = path.join(process.cwd(), 'doc', 'articles', `${slug}.md`);
  const content = await getMarkdownData(pathToContent);

  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]} className='markdown'>
        {content}
      </ReactMarkdown>
    </>
  );
};

export default ArticlePage;
