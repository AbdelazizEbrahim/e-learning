'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      if (!res.ok) {
        throw new Error('Feedback submission failed');
      }

      const data = await res.json();
       alert('Feedback submitted successfully');

       setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error:', err.message);
      alert('An error occurred while submitting feedback');
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className='relative h-120 w-screen mt-0 overflow-hidden'>
      <div className='relative w-full h-full'>
        <main className='flex flex-col items-center w-full h-full pt-2'>
          <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg max-w-md mx-auto'>
            <h1 className='text-3xl font-semibold mb-4'>Contact Us</h1>
            <p className='text-lg mb-8'>
              Have questions or feedback? Reach out to us!
            </p>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <Label htmlFor='email'>Email*</Label>
              <Input
                type='email'
                id='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-transparent border border-gray-300 rounded-full p-2'
              />
              <Label htmlFor='message'>Message*</Label>
              <Textarea
                id='message'
                placeholder='Your message...'
                rows='4'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className='bg-transparent border border-gray-300 rounded-sm p-2'
              />
              <Button
                type='submit'
                className={`w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-400 transition-colors duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
