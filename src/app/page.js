'use client';

import Image from 'next/image';
import React, { useState } from 'react';

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
    <div className='relative w-screen h-screen overflow-hidden'>

      <main className='relative flex flex-col items-center justify-center w-full h-full p-4'>
        <h1 className='text-3xl font-bold mb-4 text-black'>Welcome to ToDo App</h1>
        <p className='text-lg mb-8 text-black'>Choose an action below to get started.</p>
        <div className='flex flex-col gap-4'>
          {/* Add buttons or other components here */}
        </div>
      </main>
    </div>
  );
}
