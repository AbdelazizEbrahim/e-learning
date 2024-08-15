import connect from '../../utils/db'; // Import your database connection function
import Admin from '../../model/admin'; // Import your Admin model

// Ensure dbConnect is called
connect();

// Handler function for API routes
const handler = async (req, res) => {
  switch (req.method) {
    case 'POST': // Create a new admin
      return createAdmin(req, res);
    case 'GET': // Get all admins
      return getAdmins(req, res);
    case 'PUT': // Update an admin
      return updateAdmin(req, res);
    case 'DELETE': // Delete an admin
      return deleteAdmin(req, res);
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

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an admin
const updateAdmin = async (req, res) => {
  const { id } = req.query; // Assuming you pass the admin ID in the query string
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
  const { id } = req.query; // Assuming you pass the admin ID in the query string
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
