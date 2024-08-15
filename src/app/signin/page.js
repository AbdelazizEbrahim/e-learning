// src/app/signin/page.js
'use client';

import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'; // Correct import
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Sign up failed');
      
      await res.json();
      router.push('/signin');
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) throw new Error('Sign in failed');
  
      const data = await res.json();
  
      // Save the token to local storage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
  
      if (data.redirectUrl === '/admin') {
        router.push('/admin');
      } else {
        router.push('/main');
      }
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <main className='relative flex items-center justify-center w-full h-full bg-black/50'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-md'>
          <div className='my-4'>
            <h1 className='text-3xl font-semibold mb-2'>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h1>
            <p className='mt-2 text-slate-400'>
              {isSignUp
                ? 'Create an account to get started.'
                : 'Log in to your account.'}
            </p>
          </div>

          <Button
            type='button'
            className="flex items-center w-full gap-4 px-12 py-2 bg-transparent border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-300"
          >
            <FcGoogle />
            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
          </Button>

          <form
            onSubmit={isSignUp ? handleSignUp : handleSignIn}
            className='w-full mt-4'
          >
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

            {isSignUp && (
              <>
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
              </>
            )}

            <Button
              type="submit"
              className={`w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>

          <p className='mt-4 text-xs text-slate-200'>
            {isSignUp
              ? 'Already have an account? '
              : 'Don’t have an account? '}
            <Button
              type='button'
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </p>

          <p className='mt-4 text-xs text-slate-200'>
            Forgot password?{' '}
            <Link href="/reset-password" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
              Reset Password
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
