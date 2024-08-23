// // contexts/CartContext.js
// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const { userEmail } = React.useContext(UserContext);

//   useEffect(() => {
//     if (userEmail) {
//       const fetchCartCount = async () => {
//         try {
//           const response = await fetch(`/api/cart?email=${userEmail}`);
//           if (!response.ok) throw new Error('Failed to fetch cart notification count');
//           const data = await response.json();
//           setCartCount(data.length || 0);
//         } catch (error) {
//           console.error('Error fetching cart notification count:', error);
//           setCartCount(0);
//         }
//       };

//       fetchCartCount();
//     }
//   }, [userEmail]);

//   return (
//     <CartContext.Provider value={{ cartCount }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
