'use client';

import RightSideBar from '../../components/admin components/rightBar';
import AdminDashboard from '../../components/admin components/dashboard';

export default function Admin() {
  
  return (
    <div className='relative w-screen h-screen mt-4 ml-32 mr-48'>
      <RightSideBar className="hidden lg:block" />
      <AdminDashboard />
    </div>
  );
}
