'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log(res);
      console.log('Result');

      if (!res.ok) {
        console.log('Reset password failed');
        throw new Error('Reset password failed');
      }

      const data = await res.json();
      console.log('Data fetched:', data);

      // Handle successful password reset
      router.push('/signin/enterOtp');
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className='relative w-screen h-screen'>
      <main className='relative flex items-center justify-center w-full h-full '>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg'>
          <div className='my-6'>
            <h1 className='text-3xl font-semibold'>Reset Password</h1>
            <p className='mt-2 text-slate-400'>Enter your email to reset your password.</p>
          </div>

          <form onSubmit={handleResetPassword} className='w-full max-w-sm'>
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

            <Button
              type="submit"
              className={`w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <p className='mt-4 text-xs text-slate-200'>
            @2024 All rights reserved.
          </p>
          <p className='mt-4 text-xs text-slate-200'>
            Do not have an account?{' '}
            <Link href="/signin" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
              Sign In
            </Link>
            </p>
        </div>
      </main>
    </div>
  );
}

