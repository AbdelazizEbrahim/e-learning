'use client';

import React, { useEffect, useState } from 'react';
import 'chart.js/auto'; 
import RightSideBar from '@/components/admin components/rightBar';
import AdminDashboard from '@/components/admin components/dashboard';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const admin = () => {
    return (
    <div className='relative w-screen h-screen mt-4 ml-32 '>
      <AdminDashboard />
      <RightSideBar className="hidden lg:block" />
      </div>
    )
  
};

export default admin;
