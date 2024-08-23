// // contexts/UserContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import jwt from 'jsonwebtoken';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userRole, setUserRole] = useState(null);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       try {
//         const decoded = jwt.decode(token);
//         if (decoded && decoded.role) {
//           setUserRole(decoded.role);
//           setUserEmail(decoded.email); // Assuming email is included in token
//         }
//       } catch (error) {
//         console.error('Failed to decode token:', error);
//       }
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ userRole, userEmail }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
