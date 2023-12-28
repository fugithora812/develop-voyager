import React from 'react';
import { type NextPage } from 'next';

const AdminDashboardPage: NextPage = () => {
  return (
    <>
      <main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <div className="flex items-start justify-between">
          <div className="relative hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
            <div className="h-full bg-white rounded-2xl dark:bg-gray-700">
              <div className="flex items-center justify-center pt-6">
                <svg width="35" height="30" viewBox="0 0 256 366" version="1.1" preserveAspectRatio="xMidYMid">
                  <defs>
                    <linearGradient
                      x1="12.5189534%"
                      y1="85.2128611%"
                      x2="88.2282959%"
                      y2="10.0225497%"
                      id="linearGradient-1"
                    >
                      <stop stopColor="#FF0057" stopOpacity="0.16" offset="0%"></stop>
                      <stop stopColor="#FF0057" offset="86.1354%"></stop>
                    </linearGradient>
                  </defs>
                  <g>
                    <path
                      d="M0,60.8538006 C0,27.245261 27.245304,0 60.8542121,0 L117.027019,0 L255.996549,0 L255.996549,86.5999776 C255.996549,103.404155 242.374096,117.027222 225.569919,117.027222 L145.80812,117.027222 C130.003299,117.277829 117.242615,130.060011 117.027019,145.872817 L117.027019,335.28252 C117.027019,352.087312 103.404567,365.709764 86.5997749,365.709764 L0,365.709764 L0,117.027222 L0,60.8538006 Z"
                      fill="#001B38"
                    ></path>
                    <circle
                      fill="url(#linearGradient-1)"
                      transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675) "
                      cx="147.013244"
                      cy="147.014675"
                      r="78.9933938"
                    ></circle>
                    <circle
                      fill="url(#linearGradient-1)"
                      opacity="0.5"
                      transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675) "
                      cx="147.013244"
                      cy="147.014675"
                      r="78.9933938"
                    ></circle>
                  </g>
                </svg>
              </div>
              <nav className="mt-6">
                <div>
                  <a
                    className="flex items-center justify-start w-full p-4 my-2 font-thin text-blue-500 uppercase transition-colors duration-200 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 dark:from-gray-700 dark:to-gray-800"
                    href="#"
                  >
                    <span className="text-left">
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 2048 1792"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path>
                      </svg>
                    </span>
                    <span className="mx-4 text-sm font-normal">Dashboard</span>
                  </a>
                </div>
              </nav>
            </div>
          </div>
          <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
            <header className="z-40 items-center w-full h-16 bg-white shadow-lg dark:bg-gray-700 rounded-2xl">
              <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
                <div className="relative flex items-center w-full pl-1 lg:max-w-68 sm:pr-2 sm:ml-0">
                  <div className="container relative left-0 z-50 flex w-3/4 h-full">
                    <div className="relative flex items-center w-full h-full lg:w-64 group">
                      <div className="absolute z-50 flex items-center justify-center w-auto h-10 p-3 pr-2 text-sm text-gray-500 uppercase cursor-pointer sm:hidden">
                        <svg
                          fill="none"
                          className="relative w-5 h-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <svg
                        className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                      </svg>
                      <input
                        type="text"
                        className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
                        placeholder="Search"
                      />
                      <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboardPage;
