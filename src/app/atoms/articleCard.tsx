import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

interface Props {
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  href: string;
  latest?: boolean;
}

const ArticleCard: NextPage<Props> = ({ imageUrl, category, title, description, href, latest }: Props) => (
  <div
    className={`${latest ? 'w-[25rem] min-[1170px]:w-full' : 'w-[25rem]'}
  flex flex-col items-center my-6 space-y-4 md:space-x-4 md:space-y-0 md:flex-row`}
  >
    <div className="m-auto overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 w-full">
      <Link href={href} className={`w-inherit block h-full`}>
        {/* eslint-disable-next-line */}
        <img alt="blog photo" src={imageUrl} className="object-cover w-full max-h-40" />
        <div className="w-100 p-4 bg-white dark:bg-gray-800 break-words">
          <div className="flex items-start mb-3">
            <div className="badge badge-primary text-md">{category}</div>
            {latest && <div className="badge badge-secondary ml-1">Latest</div>}
          </div>
          <p className="truncate mb-2 text-xl font-medium text-gray-800 dark:text-white">{title}</p>
          <p className="truncate font-light text-gray-400 dark:text-gray-300 text-md ">{description}</p>
        </div>
      </Link>
    </div>
  </div>
);

export default ArticleCard;
