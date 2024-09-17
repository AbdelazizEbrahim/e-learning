import connect from '@/utils/db'; 
import InstructorProfile from '@/model/InstrutorProfile';

// Handler function for API requests
const handler = async (req, res) => {
  console.log("Connecting to the database...");
  await connect(); // Ensure you are connected to the database
  console.log("Connected to the database.");

  const { method } = req;
  const { email, isApproved } = req.query; 
  console.log("Request method:", method);
  console.log("Query params:", req.query);

  switch (method) {
    case 'POST':
      try {
        console.log("Received request body:", req.body);
    
        const newProfile = new InstructorProfile(req.body);
        console.log("Profile created:", newProfile);
    
        const savedProfile = await newProfile.save();
        console.log("Saving profile...");
        if (savedProfile) {
          console.log("Profile saved successfully:", savedProfile);
        } else {
          console.log("Failed to save profile.");
        }
        res.status(201).json({ success: true, data: savedProfile });
      } catch (error) {
        console.error("Error saving profile:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
      case 'PUT':
  try {
    console.log("Update request for email:", email);
    if (!email) {
      console.log("Email not provided.");
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Check if the request is for toggling approval status
    if (req.body.toggleApproval) {
      const profile = await InstructorProfile.findOne({ email });
      
      if (!profile) {
        console.log("Instructor not found");
        return res.status(404).json({ success: false, error: "Instructor not found" });
      }

      // Toggle the isApproved status
      const updatedProfile = await InstructorProfile.findOneAndUpdate(
        { email },
        { isApproved: !profile.isApproved },
        { new: true }
      );

      console.log("Instructor approval status toggled successfully:", updatedProfile);
      return res.status(200).json({ success: true, data: updatedProfile });
    }

    // Handle regular profile updates
    const updatedProfile = await InstructorProfile.findOneAndUpdate(
      { email },
      req.body,
      { new: true, runValidators: true }
    );

    console.log("Updating profile...");
    if (!updatedProfile) {
      console.log("Profile not found for email:", email);
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    console.log("Profile updated successfully:", updatedProfile);
    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).json({ success: false, error: error.message });
  }
  break;

        case 'GET':
      try {
        console.log("Fetching profile(s)...");
        if (email) {
          console.log("Fetching profile for email:", email);
          const profile = await InstructorProfile.findOne({ email });
          if (!profile) {
            console.log("Profile not found for email:", email);
            return res.status(404).json({ success: false, error: 'Profile not found' });
          }
          console.log("Profile found:", profile);
          res.status(200).json({ success: true, data: profile });
        } else {
          const profiles = await InstructorProfile.find({});
          console.log("Fetching all profiles...");
          res.status(200).json({ success: true, data: profiles });
        }
      } catch (error) {
        console.error("Error fetching profile(s):", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        console.log("Delete request for email:", email);
        if (!email) {
          console.log("Email not provided.");
          return res.status(400).json({ success: false, error: 'Email is required' });
        }
        const deletedProfile = await InstructorProfile.findOneAndDelete({ email });
        console.log("Deleting profile...");
        if (!deletedProfile) {
          console.log("Profile not found for email:", email);
          return res.status(404).json({ success: false, error: 'Profile not found' });
        }
        console.log("Profile deleted successfully:", deletedProfile);
        res.status(200).json({ success: true, data: deletedProfile });
      } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      console.log(`Method ${method} not allowed.`);
      res.setHeader('Allow', ['POST', 'PUT', 'GET', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
      break;
  }
};

export default handler;











