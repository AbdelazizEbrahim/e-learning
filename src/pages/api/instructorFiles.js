import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import File from '@/model/InstructorFile';
import connect from '@/utils/db';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  await connect();

  const { email } = req.query;

  // Validate that email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email query parameter is required' });
  }

  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'files');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      multiples: true,
      uploadDir: uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`, 
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing form data' });
      }

      console.log("Fields received:", fields);
      console.log("Files received:", files);

      try {
        // Delete existing files for the provided email
        await File.deleteMany({ userEmail: email });

        // Process and save files
        const filePromises = [];

        if (files.degree) {
          const degreeFile = Array.isArray(files.degree) ? files.degree[0] : files.degree;
          const degreeFileData = new File({
            userEmail: email,
            filename: degreeFile.originalFilename,
            fileComponent: 'degree',
            fileType: degreeFile.mimetype,
            filePath: `/uploads/files/${degreeFile.newFilename}`,
            size: degreeFile.size,
          });
          console.log("Saving degree file:", degreeFileData);
          filePromises.push(degreeFileData.save());
        }

        if (files.cv) {
          const cvFile = Array.isArray(files.cv) ? files.cv[0] : files.cv;
          const cvFileData = new File({
            userEmail: email,
            filename: cvFile.originalFilename,
            fileComponent: 'cv',
            fileType: cvFile.mimetype,
            filePath: `/uploads/files/${cvFile.newFilename}`,
            size: cvFile.size,
          });
          console.log("Saving CV file:", cvFileData);
          filePromises.push(cvFileData.save());
        }

        const uploadedFiles = await Promise.all(filePromises);
        console.log("Uploaded files:", uploadedFiles);
        res.status(200).json({ success: true, message: 'Files uploaded successfully', files: uploadedFiles });
      } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Failed to upload files', error });
      }
    });
  } else if (req.method === 'GET') {
    try {
      // Find files based on userEmail
      const files = await File.find({ userEmail: email });

      if (!files.length) {
        return res.status(404).json({ message: 'No files found for the provided email' });
      }

      // Map through the files and extract relevant details
      const fileDetails = files.map(file => ({
        fileName: file.filename,
        filePath: file.filePath,
        fileComponent: file.fileComponent,
      }));

      res.status(200).json({ files: fileDetails });
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: 'Failed to retrieve files', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
