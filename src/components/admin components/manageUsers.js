'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageUser() {
  const [action, setAction] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  const handleOutsideClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setShowForm(false);
      setAction(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleAction = async (actionType, url, method, body) => {
    // console.log(actionType, url, method, body);
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      // console.log("Response: ",response);
      if (!response.ok) {
      // console.log(`Failed to ${actionType}`);
      } else {
      alert(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successfully!`);
      setEmail('');
      setRole('');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      setShowForm(false);
      setAction(null);
    }
  };

  const handleChangeRole = (e) => {
    e.preventDefault();
    handleAction('change role', '/api/auth/signup', 'PUT', { email, role });
  };

  const handleDeleteUser = (e) => {
    e.preventDefault();
    handleAction('delete user', '/api/auth/signup', 'DELETE', { email });
  };

  const handleRemoveInstructor = (e) => {
    e.preventDefault();
    handleAction('remove instructor', '/api/instructorProfile', 'DELETE', { email });
  };

  const handleRemoveStudent = (e) => {
    e.preventDefault();
    handleAction('remove student', '/api/userProfile', 'DELETE', { email });
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-100'>
      <main className='p-6 w-64 max-w-xs bg-black rounded-lg'>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <button onClick={() => { setAction('changeRole'); setShowForm(true); }} className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300'>
            Change Role
          </button>
          <button onClick={() => { setAction('delete'); setShowForm(true); }} className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-300'>
            Delete User
          </button>
          <button onClick={() => { setAction('removeInstructor'); setShowForm(true); }} className='bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-400 transition-colors duration-300'>
            Remove Instructor
          </button>
          <button onClick={() => { setAction('removeStudent'); setShowForm(true); }} className='bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-400 transition-colors duration-300'>
            Remove Student
          </button>
        </div>

        {showForm && (
          <div ref={formRef} className='fixed inset-0 flex items-center justify-center'>
            <div className='bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg w-1/4 max-w-sm relative'>
              <button onClick={() => { setShowForm(false); setAction(null); }} className='absolute top-2 right-2 text-red-600 text-xl'>
                &times;
              </button>
              <h1 className='text-2xl font-semibold mb-4 text-center text-white'>{action === 'changeRole' ? 'Change Role' : action === 'delete' ? 'Delete User' : action === 'removeInstructor' ? 'Remove Instructor' : 'Remove Student'}</h1>

              <form onSubmit={action === 'changeRole' ? handleChangeRole : action === 'delete' ? handleDeleteUser : action === 'removeInstructor' ? handleRemoveInstructor : handleRemoveStudent} className='space-y-4'>
                <div className='flex flex-col'>
                  <label className='text-sm mb-1 text-white'>Email</label>
                  <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 rounded bg-gray-200 text-black w-full' required />
                </div>
                {action === 'changeRole' && (
                  <div className='flex flex-col'>
                    <label className='text-sm mb-1 text-white'>New Role</label>
                    <input type='text' value={role} onChange={(e) => setRole(e.target.value)} className='p-2 rounded bg-gray-200 text-black w-full' required />
                  </div>
                )}
                <button type='submit' className={`py-2 px-4 rounded w-full ${action === 'changeRole' ? 'bg-blue-600 hover:bg-blue-400' : action === 'delete' ? 'bg-red-600 hover:bg-red-400' : action === 'removeInstructor' ? 'bg-orange-600 hover:bg-orange-400' : 'bg-yellow-600 hover:bg-yellow-400'} text-white transition-colors duration-300`} disabled={loading}>
                  {loading ? `${action === 'changeRole' ? 'Changing...' : action === 'delete' ? 'Deleting...' : action === 'removeInstructor' ? 'Removing...' : 'Removing...'}...` : action === 'changeRole' ? 'Change Role' : action === 'delete' ? 'Delete User' : action === 'removeInstructor' ? 'Remove Instructor' : 'Remove Student'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
