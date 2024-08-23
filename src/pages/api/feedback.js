import connect from '../../utils/db';
import Feedback from '../../model/Feedback';

export default async function handler(req, res) {
    await connect();

    const { method } = req;

    switch (method) {
        // Add a new feedback
        case 'POST':
            try {
                const { email, message } = req.body;

                if (!email || !message) {
                    return res.status(400).json({ success: false, error: 'Email and message are required' });
                }

                const newFeedback = new Feedback({
                    email,
                    message,
                    read: false, // Default to unread
                });

                const feedback = await newFeedback.save();
                console.log('Feedback added:', feedback);

                res.status(201).json({ success: true, data: feedback });
            } catch (error) {
                console.error('Error adding feedback:', error);
                res.status(400).json({ success: false, error: 'Failed to add feedback' });
            }
            break;

        // Get unread feedbacks with limit
        case 'GET':
            try {
                const { limit = 3, read = false } = req.query;

                const feedbacks = await Feedback.find({ read: read })
                    .limit(parseInt(limit))
                    .exec();

                console.log('Fetched feedbacks:', feedbacks);

                res.status(200).json({ success: true, data: feedbacks });
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                res.status(400).json({ success: false, error: 'Failed to fetch feedbacks' });
            }
            break;

        // Update the `read` attribute of a feedback
        case 'PUT':
            try {
                const { email, read } = req.body;

                if (!email || read === undefined) {
                    return res.status(400).json({ success: false, error: 'Feedback Email and read status are required' });
                }

                const updatedFeedback = await Feedback.findOneAndUpdate(
                    { email }, // Find by email
                    { read }, // Update read status
                    { new: true } // Return the updated document
                );

                if (!updatedFeedback) {
                    return res.status(404).json({ success: false, error: 'Feedback not found' });
                }

                console.log('Updated feedback:', updatedFeedback);
                res.status(200).json({ success: true, data: updatedFeedback });
            } catch (error) {
                console.error('Error updating feedback:', error);
                res.status(400).json({ success: false, error: 'Failed to update feedback' });
            }
            break;

        default:
            res.status(405).json({ success: false, error: 'Method not allowed' });
            break;
    }
}