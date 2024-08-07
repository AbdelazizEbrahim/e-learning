import connect from '../../../utils/db';
import User from '../../../model/User'; 
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  await connect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    console.log('missing email');
    return res.status(400).json({ message: 'Missing email' });
  }

  try {
    // Find the user by email
    const resetUser = await User.findOne({ email });
    if (!resetUser) {
      console.log('missing user');
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    console.log(otp.toString());

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true,
      socketTimeout: 30000,
    });

    console.log(transporter.toString());

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
    };

    await transporter.sendMail({
      ...mailOptions,
      subject: "Your OTP code",
      text: ` Your OTP code is ${otp}`
    });

    // Save OTP to user document (or handle according to your needs)
    if (resetUser.otp === null) {
      resetUser.otp = otp;
      await resetUser.save();
    } else {
      // Update OTP if it already exists
      resetUser.otp = otp;
      await resetUser.save();
    }

    res.status(200).json({ message: 'OTP code sent successfully' });
  } catch (error) {
    console.error('Error during OTP sending:', error); // Log error for debugging
    return res.status(500).json({ message: error.message });
  }
}
