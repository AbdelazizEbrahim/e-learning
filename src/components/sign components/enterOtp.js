'use client'

import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!res.ok) {
        console.log('Verification failed');
        throw new Error(err);
        return res.json({message: message.err});
      }

      console.log(res);
      const data = await res.json();
      setMessage('Password has been reset successfully.');

      // Optionally, redirect or show a success message
      router.push('/signin'); // Redirect to sign-in page after successful reset
    } catch (err) {
      console.log('Error:', err.message);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className='relative w-screen h-screen'>
      <main className='relative flex items-center justify-center w-full h-full bg-black/50'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg'>
          <div className='my-4'>
            <h1 className='text-3xl font-semibold'>Verify OTP</h1>
            <p className='mt-2 text-slate-400'>Enter your email, OTP, and new password.</p>
          </div>

          <form onSubmit={handleVerifyOtp} className='w-full max-w-sm'>
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

            <Label htmlFor="otp">OTP*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full border border-gray-300 transition-colors duration-300 hover:border-gray-500 focus:border-gray-500"
              type="text"
              id="otp"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <Label htmlFor="new-password">New Password*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full border border-gray-300 transition-colors duration-300 hover:border-gray-500 focus:border-gray-500"
              type="password"
              id="new-password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Label htmlFor="confirm-password">Confirm New Password*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full border border-gray-300 transition-colors duration-300 hover:border-gray-500 focus:border-gray-500"
              type="password"
              id="confirm-password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className={`w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify and Reset Password'}
            </Button>

            {message && (
              <p className='mt-4 text-xs text-slate-200'>
                {message}
              </p>
            )}
          </form>
          <p className='mt-4 text-xs text-slate-200'>
            {' '}
            <Link href="/signin" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
              Sign In
            </Link>
            </p>
        </div>
      </main>
    </div>
  );
}
