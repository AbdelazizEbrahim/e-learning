import connect from '../../utils/db';
import Cart from '../../model/Cart';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    await connect();

    switch (req.method) {
        // Create a new cart entry (enroll in a course)
        case 'POST':
            try {
                const { userEmail, courseCode, price, paymentId, paymentStatus, status } = req.body;

                if (!userEmail || !courseCode) {
                    return res.status(400).json({ message: 'userEmail and courseCode are required' });
                }

                // Check if the user is already enrolled in the course
                const existingEntry = await Cart.findOne({ userEmail, courseCode });

                if (existingEntry) {
                    return res.status(400).json({ message: 'User is already enrolled in this course' });
                }

                // Generate a unique order number
                const latestOrder = await Cart.findOne().sort({ orderNumber: -1 });
                const orderNumber = latestOrder ? latestOrder.orderNumber + 1 : 1;

                const newCartEntry = new Cart({
                    userEmail,
                    courseCode,
                    orderNumber,
                    price,
                    paymentId,
                    paymentStatus,
                    status,
                });

                await newCartEntry.save();
                return res.status(201).json({ message: 'Enrollment successful', cartEntry: newCartEntry });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to enroll in course', error: err.message });
            }

        // Fetch cart entries (enrollments)
        case 'GET':
            try {
                const { userEmail } = req.query;

                // Ensure userEmail is provided to fetch specific cart entries
                if (!userEmail) {
                    return res.status(400).json({ message: 'userEmail is required' });
                }

                // Fetch cart entries based on userEmail
                const cartEntries = await Cart.find({ userEmail });
                return res.status(200).json(cartEntries.length ? cartEntries : { message: 'No cart entries found' });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to fetch cart entries', error: err.message });
            }

        // Update a cart entry (e.g., update payment status)
        case 'PUT':
            try {
                const { userEmail, courseCode, paymentStatus } = req.body;

                if (!userEmail || !courseCode) {
                    return res.status(400).json({ message: 'userEmail and courseCode are required' });
                }

                const updatedCartEntry = await Cart.findOneAndUpdate(
                    { userEmail, courseCode },
                    { paymentStatus },
                    { new: true }
                );

                if (!updatedCartEntry) {
                    return res.status(404).json({ message: 'Cart entry not found' });
                }

                return res.status(200).json({ message: 'Cart entry updated successfully', cartEntry: updatedCartEntry });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to update cart entry', error: err.message });
            }

        // Delete a cart entry (unenroll from a course)
        case 'DELETE':
            try {
                const { userEmail, courseCode } = req.body;

                if (!userEmail || !courseCode) {
                    return res.status(400).json({ message: 'userEmail and courseCode are required' });
                }

                const deletedCartEntry = await Cart.findOneAndDelete({ userEmail, courseCode });

                if (!deletedCartEntry) {
                    return res.status(404).json({ message: 'Cart entry not found' });
                }

                return res.status(200).json({ message: 'Cart entry deleted successfully' });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to delete cart entry', error: err.message });
            }

        // Method not allowed
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
};
