'use client';
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='bg-black text-white py-6'>
            <div className='w-full mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col items-center justify-between space-y-4 md:space-y-0 md:flex-row'>
                    <div className='text-center md:text-left'>
                        <p className='text-sm'>
                            &copy; {new Date().getFullYear()} Abdelaziz E. All rights reserved.
                        </p>
                    </div>
                    <div className='flex space-x-4'>
                        <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-400'>
                            <FaFacebookF className='h-6 w-6' />
                        </a>
                        <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-400'>
                            <FaTwitter className='h-6 w-6' />
                        </a>
                        <a href='https://www.instagram.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-400'>
                            <FaInstagram className='h-6 w-6' />
                        </a>
                        <a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-400'>
                            <FaLinkedinIn className='h-6 w-6' />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
