'use client';

import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import jwt from 'jsonwebtoken';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        console.log('Sign up failed');
      }

      await res.json();
      if(res.ok){
        window.location.reload();
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Sign in failed');

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);
      }

      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwt.decode(token);
          if (decoded && decoded.role) {
            if (decoded.role === 'user') {
              router.push('/user');
            } else if (decoded.role === 'admin') {
              router.push('/admin');
            } else if (decoded.role === 'instructor') {
              router.push('/instructor');
            }
          } else {
            setError('Role not recognized. Please sign up first.');
          }
        } catch (err) {
          setError('Error: ' + err.message);
        } finally {
          setLoading(false);
        }
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative w-screen h-screen overflow-hidden bg-gray-100 flex items-center justify-center'>
      <div className='flex w-full max-w-4xl bg-white shadow-lg rounded-lg'>
        <div className='lg:w-1/2 md:w-2/3 w-full p-6'>
          <div className='mb-4'>
            <h1 className='text-3xl font-semibold mb-2'>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
            <p className='text-slate-400'>
              {isSignUp ? 'Create an account to get started.' : 'Log in to your account.'}
            </p>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

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

                <Label htmlFor="role">Role*</Label>
                <select
                  id="role"
                  className="mt-2 mb-4 bg-transparent rounded-full border border-gray-300 transition-colors duration-300 hover:border-gray-500 focus:border-gray-500 w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Role</option>
                  <option value="user">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </>
            )}

            <Button
              type="submit"
              className={`w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-4 py-2 text-lg transition-colors duration-300"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </Button>

              </>
            ) : (
              <>
                Do not have an account?{' '}
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-4 py-2 text-lg transition-colors duration-300"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </p>

          {!isSignUp && (
            <div className="mt-4 text-sm text-gray-600">
              <Link href="/signin/reset-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
        </div>
        <div className='w-1/2 bg-gray-200 hidden lg:flex items-center justify-center'>
        <div className="text-center px-8 py-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome Back!</h2>
          <p className="text-lg text-gray-600 mb-6">Please sign in to continue or create a new account to get started.</p>
        </div>
      </div>

      </div>
    </div>
  );
}
