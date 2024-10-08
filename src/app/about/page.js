'use client';

import React, { useState, useEffect } from 'react';

export default function About() {
  const [aboutTexts, setAboutTexts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAboutTexts = async () => {
      try {
        const response = await fetch('/api/aboutText');
        const data = await response.json();
        const sortedData = data.data.sort((a, b) => a.priority - b.priority);
        setAboutTexts(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAboutTexts();
  }, []);

  const handleContactClick = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/contact';
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative w-screen h-screen p-0 mt-96 md:mt-44 lg:mt-44">
      <main className="flex flex-col items-center justify-center w-full h-full p-0">
        <div className="bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-4xl sm:m-20 lg:m-12 ">
          <h1 className="text-3xl font-semibold mb-4 mt-12 text-center">About Us</h1>
          {aboutTexts.map((text, index) => (
            <section key={index} className="mb-8 flex flex-col items-center ">
              <h2 className="text-2xl font-semibold mb-4 text-center">{text.title}</h2>
              <p className="text-lg text-center w-full max-w-xl">{text.mainBody}</p>
              {index < aboutTexts.length - 1 && (
                <hr className="my-8 border-gray-400 w-full max-w-4xl mx-auto" />
              )}
            </section>
          ))}
          <section className="mt-6 text-center">
            <button
              onClick={handleContactClick}
              className={`px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-400 transition-colors duration-300 flex items-center justify-center py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="none" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                'Contact Us'
              )}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
