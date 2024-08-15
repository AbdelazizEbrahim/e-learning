'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageUser() {
  const [action, setAction] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [students, setStudents] = useState([]); // Default to empty array
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (action === 'showStudents') {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/enroll'); // Ensure this endpoint matches your API
          if (!response.ok) console.log('Failed to fetch students');
          console.log(response);
          const data = await response.json();
          console.log(data);
          setStudents(data.students || []); // Default to empty array if undefined
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [action]);

  const handleChangeRole = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/signup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });
      if (!response.ok) throw new Error('Failed to change role');
      alert('Role changed successfully!');
      setEmail('');
      setRole('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/signup`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      alert('User deleted successfully!');
      setEmail('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative w-screen h-screen'>
      <main className='flex flex-col items-center justify-center w-full h-full p-6'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-2/5 max-w-5xl'>
          <h1 className='text-3xl font-semibold mb-4'>Manage Users</h1>

          <div className='flex flex-col items-center mb-4'>
            <button onClick={() => setAction('changeRole')} className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300 mb-2 w-1/2'>
              Change Role
            </button>
            <button onClick={() => setAction('delete')} className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-300 mb-2 w-1/2'>
              Delete User
            </button>
            <button onClick={() => setAction('showStudents')} className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300 mb-2 w-1/2'>
              Show Student List
            </button>
          </div>

          {action === 'changeRole' && (
            <form onSubmit={handleChangeRole} className='space-y-4 mb-4 flex flex-col items-center w-full'>
              <div className='flex flex-col w-4/5'>
                <label className='text-sm mb-1'>Email</label>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 rounded bg-gray-700 text-white' required />
              </div>
              <div className='flex flex-col w-4/5'>
                <label className='text-sm mb-1'>New Role</label>
                <input type='text' value={role} onChange={(e) => setRole(e.target.value)} className='p-2 rounded bg-gray-700 text-white' required />
              </div>
              <button type='submit' className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-400 transition-colors duration-300 w-1/3' disabled={loading}>
                {loading ? 'Changing...' : 'Change Role'}
              </button>
            </form>
          )}

          {action === 'delete' && (
            <form onSubmit={handleDeleteUser} className='space-y-4 mb-4 flex flex-col items-center'>
              <div className='flex flex-col w-4/5'>
                <label className='text-sm mb-1'>Email</label>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 rounded bg-gray-700 text-white' required />
              </div>
              <button type='submit' className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-300 w-1/3' disabled={loading}>
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </form>
          )}

          {action === 'showStudents' && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              {loading ? (
                <p className='text-white text-center'>Loading...</p>
              ) : (
                students.length > 0 ? (
                  students.map((student) => (
                    <div key={student._id} className='bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs'>
                      <h2 className='text-lg font-semibold'>Name: {student.name}</h2>
                      <p className='text-sm'>Father: {student.fatherName}</p>
                      <p className='text-sm'>ID: {student._id}</p>
                      <p className='text-sm'>City: {student.city}</p>
                    </div>
                  ))
                ) : (
                  <p className='text-white text-center'>No students found.</p>
                )
              )}
            </div>
          )}

          <footer className='mt-6'>
            <p className='text-xs text-slate-200'>@2024 All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
