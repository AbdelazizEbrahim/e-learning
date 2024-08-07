'use client'

import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Sign in failed');
      }

      const data = await res.json();
      console.log('Data fetched:', data);
      // router.push('/')

      // Handle successful sign-in
      router.push('/'); // Redirect after successful sign-in
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className='relative w-screen h-screen'>
      <Image
        className='absolute top-0 left-0 object-cover w-full h-full'
        src='/bg.jpg'
        alt='background image'
        fill
      />
      <main className='relative flex items-center justify-center w-full h-full bg-black/50'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg'>
          <div className='my-6'>
            <h1 className='text-3xl font-semibold'>Sign In</h1>
            <p className='mt-2 text-slate-400'></p>
          </div>

          <form onSubmit={handleSignUp} className='w-full max-w-sm'>
            <Button
              type='button'
              className="flex items-center w-full gap-4 px-12 py-2 bg-transparent border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              <FcGoogle />
              Sign in with Google
            </Button>

            <Label htmlFor="email">Email*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full border border-gray-300 transition-colors duration-300 hover:border-gray-500 focus:border-gray-500"
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Label htmlFor="password">Password*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full border border-gray-300 transition-colors duration-300 hover:border-gray-500 focus:border-gray-500"
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className={`w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

           <p className='mt-4 text-xs text-slate-200'>
            Do not have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
              Sign Up
            </Link>
            </p>
            <p className='mt-4 text-xs text-slate-200'>
             Forgot password?{' '}
            <Link href="/reset-password" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
              Reset Password
            </Link>
            </p>

          <p className='mt-4 text-xs text-slate-200'>
            @2024 All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
