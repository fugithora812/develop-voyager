'use client';
import React, { useEffect, useState } from 'react';
import { type NextPage } from 'next';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const Header: NextPage = (): React.ReactElement | null => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSetTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="top-0 navbar bg-gray-100 dark:bg-slate-900 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke={theme === 'light' ? 'black' : 'white'}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 dark:bg-slate-700 dark:text-slate-300 bg-gray-300 text-gray-900"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="https://github.com/fugithora812" target="_blank" rel="noopener noreferrer">
                Profile
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost text-[40px] text-gray-900 dark:text-slate-300 font-[consolas]">
          DevelopVoyager
        </Link>
      </div>
      <div className="navbar-end">
        <label className="mr-2 flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme === 'light' ? 'black' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input
            type="checkbox"
            value={theme}
            defaultChecked={theme === 'dark'}
            className="toggle theme-controller"
            onChange={handleSetTheme}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme === 'light' ? 'black' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
        <a href="https://www.buymeacoffee.com/playdrumsj0" target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line */}
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            className="h-[50px] w-[217px]"
          />
        </a>
      </div>
    </div>
  );
};

export default Header;
