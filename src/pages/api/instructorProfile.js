import connect from '@/utils/db'; 
import InstructorProfile from '@/model/InstrutorProfile';

// Handler function for API requests
const handler = async (req, res) => {
  await connect(); // Ensure you are connected to the database

  const { method } = req;
  const { email } = req.query; 

  switch (method) {
    case 'POST':
      try {
        console.log("Received request:", req.body);
    
        const newProfile = new InstructorProfile(req.body);
        console.log("Profile created:", newProfile);
    
        const savedProfile = await newProfile.save();
        if (savedProfile){
        console.log("Profile saved successfully:", savedProfile);
        } else {
          console.log("failed to save profile: ")
        }
        res.status(201).json({ success: true, data: savedProfile });
      } catch (error) {
        console.error("Error saving profile:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    case 'PUT':
      // Update Instructor Profile
      try {
        if (!email) {
          return res.status(400).json({ success: false, error: 'Email is required' });
        }
        const updatedProfile = await InstructorProfile.findOneAndUpdate(
          { email },
          req.body,
          { new: true, runValidators: true }
        );
        if (!updatedProfile) {
          return res.status(404).json({ success: false, error: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: updatedProfile });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'GET':
      // View Instructor Profile
      try {
        if (email) {
          const profile = await InstructorProfile.findOne({ email });
          if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
          }
          res.status(200).json({ success: true, data: profile });
        } else {
          const profiles = await InstructorProfile.find({});
          res.status(200).json({ success: true, data: profiles });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        if (!email) {
          return res.status(400).json({ success: false, error: 'Email is required' });
        }
        const deletedProfile = await InstructorProfile.findOneAndDelete({ email });
        if (!deletedProfile) {
          return res.status(404).json({ success: false, error: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: deletedProfile });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
      break;
  }
};

export default handler;
