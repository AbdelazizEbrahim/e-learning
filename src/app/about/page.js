// Import necessary components and modules
'use client'

import React from 'react';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className='relative w-screen h-screen p-0 mt-0'>
      <main className='flex flex-col items-center justify-center w-full h-full p-0'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mb-0'>
          <h1 className='text-3xl font-semibold mb-4'>About Us</h1>
          <p className='text-lg mb-8'>
            Welcome to our e-learning platform! We are passionate about providing high-quality education to learners worldwide.
          </p>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>Our Mission</h2>
            <p className='text-lg'>
              Our mission is to empower learners through accessible and comprehensive education, fostering a community of lifelong learners.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>Meet Our Team</h2>
            <div className='flex flex-wrap gap-4'>
              <div className='bg-white text-gray-800 p-4 rounded-lg shadow-md w-48'>
                <h3 className='text-lg font-semibold'>Abdelaziz E.</h3>
                <p>CEO & Founder</p>
              </div>
              <div className='bg-white text-gray-800 p-4 rounded-lg shadow-md w-48'>
                <h3 className='text-lg font-semibold'>Daniya A.</h3>
                <p>Lead Developer</p>
              </div>
              <div className='bg-white text-gray-800 p-4 rounded-lg shadow-md w-48'>
                <h3 className='text-lg font-semibold'>Nahom A.</h3>
                <p>Content Creator</p>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <section className='mt-6'>
            <Button
              onClick={() => window.location.href = '/contact'}
              className='w-40 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300'
            >
              Contact Us
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
