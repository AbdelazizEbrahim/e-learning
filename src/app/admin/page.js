'use client';

import { useState, useEffect } from 'react';
import Sidebar from './sideBar/page';
import RightSideBar from './rightBar/page';
import { useRouter } from 'next/navigation';
import AdminDashboard from './dashboard/page';
import AdminAccountSettings from './accountSetting/page';
import CourseList from './myCourses/page';

export default function Admin() {
  const [action, setAction] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [instructor, setInstructor] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [manageUserLoading, setManageUserLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/course');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseName, courseCode, instructor }),
      });
      if (!response.ok) throw new Error('Failed to add course');
      alert('Course added successfully!');
      setCourseName('');
      setCourseCode('');
      setInstructor('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/course/${courseCode}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete course');
      alert('Course deleted successfully!');
      setCourseCode('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/course/${courseCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseName, instructor }),
      });
      if (!response.ok) throw new Error('Failed to update course');
      alert('Course updated successfully!');
      setCourseName('');
      setCourseCode('');
      setInstructor('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (code) => {
    setEnrollLoading((prev) => ({ ...prev, [code]: true }));
    setTimeout(() => {
      alert(`Enrolled in course: ${code}`);
      setEnrollLoading((prev) => ({ ...prev, [code]: false }));
    }, 1000);
  };

  const handleManageUser = async () => {
    setManageUserLoading(true);
    setTimeout(() => {
      router.push('/manageUser'); // Redirect to Manage User page
    }, 1000); // Simulate loading
  };

  return (
    <div className='relative w-screen h-screen mt-4 ml-32 mr-48'>
      {/* <Sidebar /> */}
      <RightSideBar />
      {/* <CourseList/> */}
      {/* <AdminDashboard /> */}
      <AdminAccountSettings />
    </div>
  );
}
