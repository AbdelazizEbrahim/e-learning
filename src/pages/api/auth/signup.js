import bcrypt from 'bcryptjs';
import connect from '../../../utils/db';
import User from '../../../model/User';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === 'POST') {
    // Handle user creation
    try {
      await connect();

      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      console.log("Finding user...");
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(422).json({ message: 'User already exists!' });
      }

      console.log("Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      console.log("User created");
      return res.status(201).json({ message: 'User created!' });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // Handle fetching users
    try {
      await connect();
      const users = await User.find();
      console.log(users);
      return res.status(200).json({ users });
    } catch (error) {
      console.error('Error while fetching users:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    // Handle updating user role
    try {
      await connect();

      const { email, role } = req.body;

      if (!email || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const filter = { email };
      const update = { role };
      const options = { new: true };

      const updatedUser = await User.findOneAndUpdate(filter, update, options);

      if (updatedUser) {
        console.log('User role updated successfully');
        return res.status(200).json({ message: 'Updated role' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error while updating role:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    // Handle user deletion
    try {
      await connect();

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Missing email' });
      }

      const userDelete = await User.findOneAndDelete({ email });

      if (userDelete) {
        console.log('User deleted');
        return res.status(200).json({ message: 'User deleted' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error while deleting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Method Not Allowed
    return res.status(405).json({ message: 'Method not allowed' });
  }
};
