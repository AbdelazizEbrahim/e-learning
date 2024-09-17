import connect from '../../utils/db'; // Import your database connection function
import Admin from '../../model/Admin'; // Import your Admin model

// Ensure dbConnect is called
connect();

// Handler function for API routes
const handler = async (req, res) => {
  switch (req.method) {
    case 'POST': // Create a new admin
      return createAdmin(req, res);
    case 'GET': // Get admins based on email or all admins
      return getAdmins(req, res);
    case 'PUT': // Update an admin by email
      return updateAdminByEmail(req, res);
    case 'DELETE': // Delete an admin by email
      return deleteAdminByEmail(req, res);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { adminName, fatherName, adminEmail, password, phoneNumber, city } = req.body;
    const newAdmin = new Admin({ adminName, fatherName, adminEmail, password, phoneNumber, city });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admins based on email or fetch all admins
const getAdmins = async (req, res) => {
  const { email } = req.query; // Email passed in the query string
  try {
    if (email) {
      // Fetch one admin by email
      const admin = await Admin.findOne({ adminEmail: email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      return res.status(200).json(admin);
    } else {
      // Fetch all admins
      const admins = await Admin.find();
      return res.status(200).json(admins);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an admin by email
const updateAdminByEmail = async (req, res) => {
  const { email } = req.query; // Email passed in the query string
  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { adminEmail: email },
      req.body,
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an admin by email
const deleteAdminByEmail = async (req, res) => {
  const { email } = req.query; // Email passed in the query string
  try {
    const deletedAdmin = await Admin.findOneAndDelete({ adminEmail: email });
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
