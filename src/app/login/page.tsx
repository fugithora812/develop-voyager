'use client';
import React from 'react';
import { type NextPage } from 'next';

import Footer from '@/app/atoms/footer';
import Header from '@/app/atoms/header';
import LoginForm from '@/app/atoms/LoginForm';

const Login: NextPage = () => {
  return (
    <>
      <div className="w-full h-screen bg-gray-100 dark:bg-slate-900">
        <Header />
        <div className="flex justify-center items-center h-[85vh]">
          <LoginForm />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
