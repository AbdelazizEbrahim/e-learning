'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Chart.js library for bar graph
import 'chart.js/auto'; // Chart.js auto import for the required components
import Link from 'next/link';
import RightSideBar from '@/components/admin components/rightBar';
import AdminDashboard from '@/components/admin components/dashboard';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const admin = () => {
    return (
    <div className='relative w-screen h-screen mt-4 ml-32 '>
      <AdminDashboard />
      <RightSideBar/>
      </div>
    )
  
};

export default admin;
