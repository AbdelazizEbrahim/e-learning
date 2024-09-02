import UserProfile from '../../model/UserProfile';
import connect from '../../utils/db';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  await connect();

  if (req.method === 'GET') {
    try {
        const { email } = req.query;

        if (email) {
            // Fetch specific user profile if email is provided
            const userProfiles = await UserProfile.find({ email });

            if (userProfiles.length === 0) {
                return res.status(404).json({ message: 'User profile not found' });
            }

            // Return the user profiles directly as a flat array
            return res.status(200).json(userProfiles);
        } else {
            // Fetch all user profiles if email is not provided
            const userProfiles = await UserProfile.find({});

            // Return the user profiles directly as a flat array
            return res.status(200).json(userProfiles);
        }
    } catch (err) {
        console.error("Error while fetching user profiles:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
else if (req.method === 'POST') {
    try {
      const { fullName, email, studentId, age, gender, city, biography } = req.body;
      console.log("Data received: ", { fullName, email, studentId, age, gender, city, biography });

      const existingUser = await UserProfile.findOne({ email, studentId });
      console.log("Existence checked: ", existingUser);

      if (existingUser) {
        console.log("User already exists");
        return res.status(400).json({ message: 'User profile already exists' });
      } else {
        console.log("Adding new user...");
        const newUserProfile = new UserProfile({ fullName, email, studentId, age, gender, city, biography });
        await newUserProfile.save();
        console.log("User profile added successfully");
        return res.status(201).json({ message: 'User profile added successfully', data: newUserProfile });
      }
    } catch (err) {
      console.error("Error while adding user profile:", err.message);
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { email, fullName, age, gender, city, biography } = req.body;

      const existingUser = await UserProfile.findOne({ email });

      if (!existingUser) {
        return res.status(404).json({ message: 'User profile not found' });
      }

      existingUser.fullName = fullName || existingUser.fullName;
      existingUser.age = age || existingUser.age;
      existingUser.gender = gender || existingUser.gender;
      existingUser.city = city || existingUser.city;
      existingUser.biography = biography || existingUser.biography;

      await existingUser.save();

      return res.status(200).json({ message: 'User profile updated successfully', data: existingUser });
    } catch (err) {
      console.error("Error while updating user profile:", err.message);
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { email } = req.body;
      console.log("Email for deletion: ", email);

      const existingUser = await UserProfile.findOneAndDelete({ email });
      console.log("Deleted user profile: ", existingUser);

      if (!existingUser) {
        console.log("User profile not found");
        return res.status(404).json({ message: 'User profile not found' });
      }

      console.log("User profile deleted successfully");
      return res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (err) {
      console.error("Error while deleting user profile:", err.message);
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
