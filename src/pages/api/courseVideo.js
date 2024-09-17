import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import CourseVideo from '@/model/CourseVideo';
import connect from '@/utils/db';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, since we're using formidable for file uploads
  },
};

export default async function handler(req, res) {
  console.log('Connecting to the database...');
  await connect();
  console.log('Database connection established.');

  const { courseCode } = req.query;

  if (req.method === 'POST') {
    console.log('POST request received.');

    // Validate that courseCode is provided only for POST
    if (!courseCode) {
      console.log('No course code provided.');
      return res.status(400).json({ message: 'Course code query parameter is required for POST requests' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'courseMaterial', `${courseCode}`);
    console.log('Ensuring upload directory exists:', uploadDir);
    await fs.promises.mkdir(uploadDir, { recursive: true });
    console.log('Upload directory is ready.');

    const form = formidable({
      multiples: true, 
      uploadDir: uploadDir,
      keepExtensions: true, 
      filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`, // Custom filename
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(400).json({ error: 'File upload error' });
      }

      console.log('Form data parsed successfully.');
      console.log('Fields received:', fields);
      console.log('Files received:', files);

      const videoName = Array.isArray(fields.videoName) ? fields.videoName[0] : fields.videoName;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const orderNumber = Array.isArray(fields.orderNumber) ? Number(fields.orderNumber[0]) : Number(fields.orderNumber);
      const file = files.file;

      const filePromises = [];

      try {
        if (file) {
          const videoFile = Array.isArray(file) ? file[0] : file;
          console.log('Processing file:', videoFile);

          const videoFileData = new CourseVideo({
            courseCode,
            videoPath: `/courseMaterial/${courseCode}/${videoFile.newFilename}`,
            videoName,
            description,
            orderNumber,
          });

          console.log("Saving video file data:", videoFileData);
          filePromises.push(videoFileData.save());
        }

        const uploadedVideos = await Promise.all(filePromises);
        console.log("Uploaded videos:", uploadedVideos);
        res.status(200).json({ success: true, message: 'Video uploaded successfully', videos: uploadedVideos });
      } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ message: 'Failed to upload video', error });
      }
    });

  } else if (req.method === 'PUT') {
    // Update a video by ID
  
    const { videoId } = req.query;
    console.log("videoId: ", videoId);
    console.log('PUT request received.');
  
    if (!videoId) {
      console.log('No video ID provided.');
      return res.status(400).json({ message: 'Video ID is required for updating' });
    }
  
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(400).json({ error: 'Error parsing form data' });
      }
  
      console.log('Form data parsed for update:', { fields, files });
  
      const videoName = Array.isArray(fields.videoName) ? fields.videoName[0] : fields.videoName;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const orderNumber = Array.isArray(fields.orderNumber) ? Number(fields.orderNumber[0]) : Number(fields.orderNumber);
  
      const updateData = {
        ...(videoName && { videoName }),
        ...(description && { description }),
        ...(orderNumber && { orderNumber }),
      };
  
      if (files.file) {
        const uploadDir = path.join(process.cwd(), 'public', 'courseMaterial', `${courseCode}`);
        const videoFile = Array.isArray(files.file) ? files.file[0] : files.file;
  
        console.log('Processing new file for update:', videoFile);
  
        try {
          await fs.promises.mkdir(uploadDir, { recursive: true });
          console.log('Upload directory created successfully.');
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create upload directory' });
        }
  
        const filePath = `/courseMaterial/${courseCode}/${videoFile.newFilename}`;
        fs.renameSync(videoFile.filepath, path.join(uploadDir, videoFile.newFilename));
        console.log('File renamed and moved to:', filePath);
  
        updateData.videoPath = filePath;
      }
  
      try {
        console.log("video id:", videoId);
        const updatedVideo = await CourseVideo.findByIdAndUpdate(videoId , updateData, { new: true });
  
        if (!updatedVideo) {
          console.log('Video not found for update.');
          return res.status(404).json({ message: 'Video not found' });
        }
  
        console.log('Video updated successfully:', updatedVideo);
        res.status(200).json({ success: true, message: 'Video updated successfully', video: updatedVideo });
      } catch (error) {
        console.error('Failed to update video:', error);
        res.status(500).json({ message: 'Failed to update video', error });
      }
    });
  }
   else if (req.method === 'DELETE') {
    console.log('DELETE request received.');

    const { videoId } = req.query;

    console.log("delete idde:", videoId);

    if (!videoId) {
      console.log("Video Id required");
      return res.status(400).json({ message: 'Video ID is required' });
    }

    try {
      const video = await CourseVideo.findOneAndDelete({ _id : videoId });
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      const filePath = path.join(process.cwd(), 'public', video.videoPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      console.log("Video deleted successfully");
      res.status(200).json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ message: 'Failed to delete video', error });
    }
  } else if (req.method === 'GET') {
    console.log('GET request received.');

    try {
      console.log('Finding videos for course code:', courseCode);
      const videos = await CourseVideo.find({ courseCode }).sort({ orderNumber: 1 });

      if (!videos.length) {
        console.log('No videos found for course code:', courseCode);
        return res.status(404).json({ message: 'No videos found for the provided course code' });
      }

      console.log('Videos found:', videos);

      const videoDetails = videos.map(video => ({
        _id: video._id,
        videoName: video.videoName,
        videoPath: video.videoPath,
        description: video.description,
        orderNumber: video.orderNumber,
      }));

      res.status(200).json({ videos: videoDetails });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ message: 'Failed to retrieve videos', error });
    }
  } else {
    console.log('Method not allowed:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
