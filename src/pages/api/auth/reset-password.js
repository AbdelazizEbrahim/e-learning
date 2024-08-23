import connect from '../../../utils/db';
import User from '../../../model/User'; 
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
    console.log('Missing email');
    return res.status(400).json({ message: 'Missing email' });
  }

  try {
    // Find the user by email
    console.log('Finding user...');
    const resetUser = await User.findOne({ email });
    if (!resetUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    console.log(`Generated OTP: ${otp}`);

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Transporter created');
    console.log(email);
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP code",
      text: `Your OTP code is ${otp}`
    };

    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent');

    // Save OTP to user document
    console.log('Saving OTP to user document...');
    resetUser.otp = otp;
    await resetUser.save();
    console.log('OTP saved');

    res.status(200).json({ message: 'OTP code sent successfully' });
  } catch (error) {
    console.error('Error during OTP sending:', error); // Log error for debugging
    return res.status(500).json({ message: 'An error occurred while sending the OTP' });
  }
};
