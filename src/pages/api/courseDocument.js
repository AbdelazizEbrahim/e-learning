import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import CourseDocument from '@/model/CourseDocument'; // Assuming you have a CourseDocument model similar to CourseVideo
import connect from '@/utils/db';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  console.log('Connecting to the database...');
  await connect();
  console.log('Database connection established.');

  const { courseCode } = req.query;

  console.log("code: ", courseCode);


  if (req.method === 'POST') {
    console.log('POST request received.');

    if (!courseCode) {
      console.log('No course code provided.');
      return res.status(400).json({ message: 'Course code query parameter is required for POST requests' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'courseMaterial', `${courseCode}`);
    console.log('Ensuring upload directory exists:', uploadDir);

    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
      console.log('Upload directory created successfully.');
    } catch (error) {
      console.error('Error creating upload directory:', error);
      return res.status(500).json({ error: 'Failed to create upload directory' });
    }

    const form = formidable({
      multiples: true,
      uploadDir: uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(400).json({ error: 'File upload error' });
      }

      console.log('Form data parsed successfully.');

      const docName = Array.isArray(fields.docName) ? fields.docName[0] : fields.docName;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const orderNumber = Array.isArray(fields.orderNumber) ? Number(fields.orderNumber[0]) : Number(fields.orderNumber);

      console.log('Parsed fields:', { docName, description, orderNumber });

      const file = files.file;
      const filePromises = [];

      try {
        if (file) {
          const docFile = Array.isArray(file) ? file[0] : file;

          console.log('Processing file:', docFile);

          const documentData = new CourseDocument({
            courseCode,
            documentPath: `/courseMaterial/${courseCode}/${docFile.newFilename}`,
            docName,
            description,
            orderNumber,
          });

          filePromises.push(documentData.save());
        }

        const uploadedDocuments = await Promise.all(filePromises);
        console.log('Documents uploaded successfully:', uploadedDocuments);
        res.status(200).json({ success: true, message: 'Document uploaded successfully', documents: uploadedDocuments });
      } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ message: 'Failed to upload document', error });
      }
    });

  } else if (req.method === 'GET') {
    // Fetch documents
    console.log('GET request received.');

    try {
      const query = courseCode ? { courseCode } : {};
      const documents = await CourseDocument.find(query).sort({ orderNumber: 1 });

      if (!documents.length) {
        console.log('No documents found for the provided course code.');
        return res.status(404).json({ message: 'No documents found for the provided course code' });
      }

      const documentDetails = documents.map(document => ({
        _id: document._id,
        docName: document.docName,
        documentPath: document.documentPath,
        description: document.description,
        orderNumber: document.orderNumber,
      }));

      console.log('Documents fetched successfully:', documentDetails);
      res.status(200).json({ documents: documentDetails });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ message: 'Failed to retrieve documents', error });
    }

  } else if (req.method === 'PUT') {
    // Update a document by ID

    const { documentId } = req.query;
    console.log("id: ", documentId);
    console.log('PUT request received.');

    if (!documentId) {
      console.log('No document ID provided.');
      return res.status(400).json({ message: 'Document ID is required for updating' });
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

      const docName = Array.isArray(fields.docName) ? fields.docName[0] : fields.docName;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const orderNumber = Array.isArray(fields.orderNumber) ? Number(fields.orderNumber[0]) : Number(fields.orderNumber);

      const updateData = {
        ...(docName && { docName }),
        ...(description && { description }),
        ...(orderNumber && { orderNumber }),
      };

      if (files.file) {
        const uploadDir = path.join(process.cwd(), 'public', 'courseMaterial', `${courseCode}`);
        const docFile = Array.isArray(files.file) ? files.file[0] : files.file;

        console.log('Processing new file for update:', docFile);

        try {
          await fs.promises.mkdir(uploadDir, { recursive: true });
          console.log('Upload directory created successfully.');
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create upload directory' });
        }

        const filePath = `/courseMaterial/${courseCode}/${docFile.newFilename}`;
        fs.renameSync(docFile.filepath, path.join(uploadDir, docFile.newFilename));
        console.log('File renamed and moved to:', filePath);

        updateData.documentPath = filePath;
      }

      try {
        console.log("doc id: ", documentId);
        const updatedDocument = await CourseDocument.findByIdAndUpdate(documentId, updateData, { new: true });

        if (!updatedDocument) {
          console.log('Document not found for update.');
          return res.status(404).json({ message: 'Document not found' });
        }

        console.log('Document updated successfully:', updatedDocument);
        res.status(200).json({ success: true, message: 'Document updated successfully', document: updatedDocument });
      } catch (error) {
        console.error('Failed to update document:', error);
        res.status(500).json({ message: 'Failed to update document', error });
      }
    });

  } else if (req.method === 'DELETE') {
    // Delete a document by ID
    console.log('DELETE request received.');

    const { documentId } = req.query;

    console.log("delete id: ", documentId);

    if (!documentId) {
      console.log('No document ID provided.');
      return res.status(400).json({ message: 'Document ID is required for deletion' });
    }

    try {
      const deletedDocument = await CourseDocument.findByIdAndDelete(documentId);

      if (!deletedDocument) {
        console.log('Document not found for deletion.');
        return res.status(404).json({ message: 'Document not found' });
      }

      const filePath = path.join(process.cwd(), 'public', deletedDocument.documentPath);
      console.log('Deleting file from filesystem:', filePath);

      try {
        fs.unlinkSync(filePath); 
        console.log('File deleted successfully.');
      } catch (err) {
        console.error('Failed to delete file from filesystem:', err);
      }

      res.status(200).json({ success: true, message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ message: 'Failed to delete document', error });
    }

  } else {
    console.log(`Method ${req.method} not allowed.`);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
