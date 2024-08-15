// src/utils/auth.js

export const getToken = () => {
    return localStorage.getItem('authToken');
};

export const decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};
