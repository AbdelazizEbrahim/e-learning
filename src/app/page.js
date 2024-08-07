'use client'

import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [loading, setLoading] = useState({
    signin: false,
    signup: false,
    resetPassword: false,
  });

  const handleNavigation = (page) => {
    setLoading((prev) => ({ ...prev, [page]: true }));

    setTimeout(() => {
      window.location.href = `/${page}`;
    }, 500); // Adjust the delay as needed
  };

  return (
    <div className='relative w-screen h-screen'>
      <Image
        className='absolute top-0 left-0 object-cover w-full h-full'
        src='/bg.jpg'
        alt='background image'
        fill
      />
      <main className='relative flex flex-col items-center justify-center w-full h-full bg-black/50'>
        <div className='text-center text-white p-6 bg-[#16202a] rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold mb-4'>Welcome to ToDo App</h1>
          <p className='text-lg mb-8'>Choose an action below to get started.</p>
          <div className='flex flex-col gap-4'>
            <Button
              onClick={() => handleNavigation('signin')}
              className={`w-full max-w-xs ${loading.signin ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-400'} transition-colors duration-300 flex items-center justify-center`}
              disabled={loading.signin}
            >
              {loading.signin ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <Button
              onClick={() => handleNavigation('signup')}
              className={`w-full max-w-xs ${loading.signup ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-400'} transition-colors duration-300 flex items-center justify-center`}
              disabled={loading.signup}
            >
              {loading.signup ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <Button
              onClick={() => handleNavigation('reset-password')}
              className={`w-full max-w-xs ${loading.resetPassword ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-400'} transition-colors duration-300 flex items-center justify-center`}
              disabled={loading.resetPassword}
            >
              {loading.resetPassword ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
