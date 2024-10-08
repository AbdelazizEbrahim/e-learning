// pages/api/about.js
import connect from '@/utils/db';
import About from '@/model/AboutText';

export default async function handler(req, res) {
  await connect(); // Ensure the database is connected

  const { method, query } = req;

  switch (method) {
    // POST: Create a new text entry
    case 'POST':
      try {
        const { title, mainBody, priority } = req.body;

        // Check if all required fields are provided
        if (!title || !mainBody || priority === undefined) {
          return res.status(400).json({ message: 'All fields (title, mainBody, priority) are required.' });
        }

        // Check if a text with the same title already exists
        const existingText = await About.findOne({ title });
        if (existingText) {
          return res.status(409).json({ message: 'Text with this title already exists. Please choose a different title.' });
        }

        // Create a new text entry
        const newText = new About({ title, mainBody, priority });
        await newText.save();
        res.status(201).json({ message: 'Text created successfully', data: newText });
      } catch (error) {
        console.error('Error creating text:', error.message);
        res.status(500).json({ message: 'Error creating text', error: error.message });
      }
      break;

    // PUT: Update the main body and priority for a text by title
    case 'PUT':
      try {
        const { title } = query;
        const { mainBody, priority } = req.body;

        // Ensure title is passed in the query and required fields are provided in the body
        if (!title) {
          return res.status(400).json({ message: 'Title is required as a query parameter.' });
        }
        if (!mainBody || priority === undefined) {
          return res.status(400).json({ message: 'Main body and priority are required.' });
        }

        // Update the text by title
        const updatedText = await About.findOneAndUpdate(
          { title },
          { mainBody, priority },
          { new: true, runValidators: true }
        );

        if (!updatedText) {
          return res.status(404).json({ message: `Text with title '${title}' not found.` });
        }

        res.status(200).json({ message: 'Text updated successfully', data: updatedText });
      } catch (error) {
        console.error('Error updating text:', error.message);
        res.status(500).json({ message: 'Error updating text', error: error.message });
      }
      break;

    // DELETE: Delete a text by title
    case 'DELETE':
      try {
        const { title } = query;

        // Ensure title is passed in the query
        if (!title) {
          return res.status(400).json({ message: 'Title is required as a query parameter.' });
        }

        // Find and delete the text by title
        const deletedText = await About.findOneAndDelete({ title });

        if (!deletedText) {
          return res.status(404).json({ message: `Text with title '${title}' not found.` });
        }

        res.status(200).json({ message: 'Text deleted successfully', data: deletedText });
      } catch (error) {
        console.error('Error deleting text:', error.message);
        res.status(500).json({ message: 'Error deleting text', error: error.message });
      }
      break;

    // GET: Fetch all texts
    case 'GET':
      try {
        const texts = await About.find();
        res.status(200).json({ message: 'Texts fetched successfully', data: texts });
      } catch (error) {
        console.error('Error fetching texts:', error.message);
        res.status(500).json({ message: 'Error fetching texts', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
