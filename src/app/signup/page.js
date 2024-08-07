'use client'

import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Sign up failed');
      }

      const data = await res.json();
      console.log('Data fetched:', data);

      // Handle successful sign-up
      router.push('/signin'); // Redirect to sign-in page after successful sign-up
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
          <div className='my-4'>
            <h1 className='text-3xl font-semibold'>Sign Up</h1>
            <p className='mt-2 text-slate-400'>Create an account to get started.</p>
          </div>

          <form onSubmit={handleSignUp} className='w-full max-w-sm'>
            <Button
              type='button'
              className="flex items-center w-full gap-4 px-12 py-2 bg-transparent border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              <FcGoogle />
              Sign up with Google
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

            <Label htmlFor="confirm-password">Confirm Password*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full border border-gray-300 transition-colors duration-300 hover:border-gray-500 focus:border-gray-500"
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className={`w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>

          <p className='mt-4 text-xs text-slate-200'>
            Have an account?{' '}
            <Link href="/signin" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
              Sign In
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
