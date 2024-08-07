import bcrypt from 'bcryptjs';
import connect from '../../../utils/db';
import User from '../../../model/User';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      await connect();

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(422).json({ message: 'User already exists!' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashedPassword,
      });

      await newUser.save();

      console.log("User Created");
      res.status(201).json({ message: 'User created!' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } 
    finally {

    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};





// {
//   "title": "homewo",
//   "description": "do it at home",
//   "dueDate": "10-10-2025",
//   "priority": 7,
//   "category": "urgent"
// }