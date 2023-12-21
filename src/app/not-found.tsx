import React from 'react';
import { type NextPage } from 'next';

import Footer from './atoms/footer';
import Header from './atoms/header';
import NotFound from './atoms/NotFound';

const NotFoundPage: NextPage = (): React.ReactElement => {
  return (
    <>
      <Header />
      <NotFound />
      <Footer />
    </>
  );
};

export default NotFoundPage;
