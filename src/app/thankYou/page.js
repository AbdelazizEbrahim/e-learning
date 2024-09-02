
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PendingPage = () => {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push('/thankYou/thankYou'); // Redirect to Thank You page after a few seconds
        }, 5000); // Set the timeout duration as needed

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#16202a] text-white">
            <h1 className="text-4xl font-bold mb-6">Your Payment is in Process</h1>
            <p className="text-xl mb-4">Please wait while we complete the transaction...</p>
            <div className="spinner mt-4 border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
        </div>
    );
};

export default PendingPage;
