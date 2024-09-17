import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import ProfilePhoto from '../../model/ProfilePhoto';
import connect from '../../utils/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connect(); 

  console.log(`Received ${req.method} request`);

  if (req.method === 'GET') {
    const { email } = req.query;
    console.log("GET request - Accepted email: ", email);

    if (!email) {
      console.log("GET request - Email query parameter is missing");
      return res.status(400).json({ message: 'Email query parameter is required' });
    }

    try {
      const photo = await ProfilePhoto.findOne({ userEmail: email });
      console.log("GET request - Photo found: ", photo);

      if (!photo) {
        console.log("GET request - Profile photo not found");
        return res.status(200).json({ data: '/user.png' });
      }

      return res.status(200).json({ success: true, data: photo });
    } catch (error) {
      console.error('GET request - Error fetching profile photo:', error);
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    console.log("POST request - Upload directory: ", uploadDir);

    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      multiples: false,
      uploadDir: uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('POST request - Error parsing form:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }

      console.log('POST request - Form parsed, fields: ', fields);
      console.log('POST request - Files: ', files);

      const imageFile = files.avatar;
      if (!imageFile || !imageFile[0].filepath) {
        console.log('POST request - No image file uploaded or file path is invalid');
        return res.status(400).json({ message: 'No image file uploaded or file path is invalid.' });
      }

      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const newFileName = `${uniqueSuffix}-${imageFile[0].originalFilename}`;
        const newFilePath = path.join(uploadDir, newFileName);

        console.log('POST request - Renaming file to: ', newFileName);
        await fs.rename(imageFile[0].filepath, newFilePath);

        const userEmail = req.query.email;
        console.log('POST request - User email: ', userEmail);
        const imageUrl = `/uploads/avatars/${newFileName}`;

        const newPhoto = new ProfilePhoto({
          userEmail: userEmail,
          imageUrl: imageUrl,
          filename: newFileName,
        });
        console.log('POST request - Saving new profile photo: ', newPhoto);
        await newPhoto.save();

        res.status(200).json({ message: 'Image uploaded and saved successfully', imageUrl: imageUrl });
      } catch (error) {
        console.error('POST request - Upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
      }
    });
  } else if (req.method === 'PUT') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    console.log("PUT request - Upload directory: ", uploadDir);

    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      multiples: false,
      uploadDir: uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('PUT request - Error parsing form:', err);
        return res.status(500).json({ message: 'Error updating image' });
      }

      console.log('PUT request - Form parsed, fields: ', fields);
      console.log('PUT request - Files: ', files);

      const imageFile = files.avatar;
      if (!imageFile || !imageFile[0].filepath) {
        console.log('PUT request - No image file uploaded or file path is invalid');
        return res.status(400).json({ message: 'No image file uploaded or file path is invalid.' });
      }

      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const newFileName = `${uniqueSuffix}-${imageFile[0].originalFilename}`;
        const newFilePath = path.join(uploadDir, newFileName);

        console.log('PUT request - Renaming file to: ', newFileName);
        await fs.rename(imageFile[0].filepath, newFilePath);

        const userEmail = req.query.email;
        console.log('PUT request - User email: ', userEmail);
        const imageUrl = `/uploads/avatars/${newFileName}`;

        const updatedPhoto = await ProfilePhoto.findOneAndUpdate(
          { userEmail: userEmail },
          { imageUrl: imageUrl, filename: newFileName },
          { new: true, upsert: true } // Create a new document if one does not exist
        );
        console.log('PUT request - Updated profile photo: ', updatedPhoto);

        res.status(200).json({ message: 'Image updated successfully', imageUrl: imageUrl });
      } catch (error) {
        console.error('PUT request - Update error:', error);
        res.status(500).json({ message: 'Failed to update image' });
      }
    });
  } else {
    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
