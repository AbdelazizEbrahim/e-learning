// pages/certificate.js
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';


const Certificate = () => {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('courseCode');
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [data, setData] = useState(null);
  const canvasRef = useRef(null);

  const fetchCertificateData = async (courseCode, email) => { 
    if (!courseCode || !email) return;

    const response = await fetch(`/api/enrollment?courseCode=${courseCode}&userEmail=${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch certificate data');
      }
      const result = await response.json();
      console.log("certificate data: ", result);
      setData(result[0]);
    
  };

  const fetchName = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No auth token found');
      return;
    }

      const decoded = jwtDecode(token);
      setEmail(decoded.email);
      const email = decoded.email;

      let api;
      if (decoded.role === 'user') {
        api = 'userProfile';
      } else if (decoded.role === 'instructor') {
        api = 'instructorProfile';
      }

      const response = await fetch(`/api/${api}?email=${email}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const name = data.data.fullName;
        setName(name);
      }
  };

  useEffect(() => {
    fetchName();
  }, []);

  useEffect(() => {
    if (courseCode && email) {
      fetchCertificateData(courseCode, email);
    }
  }, [courseCode, email]); // Ensure this runs when either courseCode or email changes

  const generateCertificate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 1000; // Width from the provided style
    canvas.height = 650; // Height from the provided style

    // Draw background
    ctx.fillStyle = 'rgb(255, 0, 238)'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw inner white rectangle
    ctx.fillStyle = 'white';
    ctx.fillRect(45, 25, 900, 600); // Positioned according to provided styles
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(45, 25, 900, 600);

    // Draw certificate title
    ctx.fillStyle = 'black';
    ctx.font = '85px "Bookman Old Style"';
    ctx.textAlign = 'center';
    ctx.fillText('Stark E-Learning', canvas.width / 2, 90); 

    // Draw main text
    ctx.font = '50px "Bookman Old Style"';
    ctx.fillText('Certificate', canvas.width / 2, 200); 
    ctx.fillText('Of Participation', canvas.width / 2, 260); 

    // Draw name
    ctx.font = 'xx-large "Lucida Handwriting"';
    ctx.fillText(name, canvas.width / 2, 350); // Centered name

    // Draw line
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(80, 375); // Start line
    ctx.lineTo(canvas.width - 80, 375); // End line
    ctx.stroke();

    // Draw acknowledgement text
    ctx.font = 'large Arial';
    ctx.fillText('For Successfully Completing', canvas.width / 2, 420);
    ctx.font = 'large Arial';
    ctx.fillText(data?.courseTitle, canvas.width / 2, 470);

    // Draw motivational text
    ctx.fillStyle = 'black';
    ctx.font = 'larger bold Arial'; 
    ctx.fillText('We Acknowledge Your Efforts. Keep Participating!', canvas.width / 2, 520); 

    // Draw instructor name
    ctx.fillText(`Instructor: ${data?.instructor}`, canvas.width / 2, 580); 

    // Draw course code
    ctx.fillText(`Course Code: ${data?.courseCode}`, canvas.width / 2, 610); // Centered course code

    // Draw date
    ctx.fillText('Date: ' + new Date().toLocaleDateString(), canvas.width / 2, 640); // Centered date
};


  // Function to download the certificate
  const downloadCertificate = () => {
    const doc = new jsPDF();
    const canvas = canvasRef.current;
  
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10, 190, 140); 
  
    doc.save('certificate.pdf');
  };
  

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold mb-4">Certificate</h1>
      <canvas ref={canvasRef} className="border border-gray-300 mb-4"></canvas>
      <button
        onClick={generateCertificate}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-400 transition-colors duration-300 mb-2"
      >
        Generate Certificate
      </button>
      <button
        onClick={downloadCertificate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;
