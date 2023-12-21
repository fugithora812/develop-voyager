import React from 'react';
import { type NextPage } from 'next';

import Footer from './atoms/footer';
import Header from './atoms/header';
import NotFound from './atoms/NotFound';

const NotFoundPage: NextPage = (): React.ReactElement => {
  return (
    <div className=" bg-gray-100 dark:bg-slate-900 h-screen">
      <Header />
      <NotFound />
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default NotFoundPage;
