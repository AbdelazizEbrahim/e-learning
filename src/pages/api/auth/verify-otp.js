import connect from '../../../utils/db';
import User from '../../../model/User';
import bcrypt from 'bcryptjs'
// import { use } from 'react';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, response)=>{
    await connect();
 if (request.method === 'POST'){
    const {email, otp, newPassword} = request.body;
    if (!email || !otp || !newPassword) {
        return response.status(400).json({ message: 'Missing email, OTP, or new password' });
      }

      try {
        const userFound = await User.findOne({ email });
    
        if (userFound) {
          if (userFound.otp !== otp) {
            return response.status(400).json({ message: 'Invalid OTP' });
          }
    
          // Hash the new password    userFound.otp = undefined; 
          const hashedPassword = await bcrypt.hash(newPassword, 12); // Use a reasonable salt rounds (e.g., 12)
          userFound.password = hashedPassword;
              
          // Save the updated user document
          await userFound.save();
    
          console.log('Password changed successfully');
          return response.status(200).json({ message: 'Password changed successfully' });
        } else {
          console.log('User does not exist');
          return response.status(404).json({ message: 'User does not exist' });
        }
      } catch (err) {
        console.error('Error:', err.message);
        return response.status(500).json({ message: 'Internal server error' });
      }
}
   else {
    console.log("Method not allowed");
    return response.status(405).json({message: "Mothod is not allowed"});
}
}

