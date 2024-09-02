import connect from '../../utils/db';
import Cart from '../../model/Cart';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    await connect();

    switch (req.method) {
        case 'POST':
            try {
                const { userEmail, courseCode, price, paymentId, paymentStatus, status, courseTitle, instructor, description, overview, requirements, whatWeWillLearn } = req.body;

                if (!userEmail || !courseCode) {
                    return res.status(400).json({ message: 'userEmail and courseCode are required' });
                }

                const existingEntry = await Cart.findOne({ userEmail, courseCode });
                if (existingEntry) {
                    return res.status(400).json({ message: 'User is already enrolled in this course' });
                }

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
                    courseTitle,
                    instructor,
                    description,
                    overview,
                    requirements,
                    whatWeWillLearn,
                });

                await newCartEntry.save();
                return res.status(201).json({ message: 'Enrollment successful', cartEntry: newCartEntry });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to enroll in course', error: err.message });
            }

        case 'GET':
            try {
                const { userEmail, paymentStatus } = req.query;

                if (!userEmail) {
                    return res.status(400).json({ message: 'userEmail is required' });
                }

                const query = { userEmail };
                if (paymentStatus) {
                    query.paymentStatus = paymentStatus;
                }

                const cartEntries = await Cart.find(query);
                return res.status(200).json(cartEntries.length ? cartEntries : { message: 'No cart entries found' });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to fetch cart entries', error: err.message });
            }

        case 'PUT':
            try {
                const { userEmail, paymentStatus } = req.body;

                if (!userEmail || !paymentStatus) {
                    return res.status(400).json({ message: 'userEmail and paymentStatus are required' });
                }

                const result = await Cart.updateMany(
                    { userEmail, paymentStatus: { $in: ['Pending', 'Failed'] } },
                    { paymentStatus }
                );

                if (result.modifiedCount > 0) {
                    return res.status(200).json({ message: 'Cart entries updated successfully' });
                } else {
                    return res.status(404).json({ message: 'No cart entries found for the given user and paymentStatus' });
                }
            } catch (err) {
                return res.status(500).json({ message: 'Failed to update cart entries', error: err.message });
            }

            case 'DELETE':
                try {
                    const { userEmail, courseCode } = req.query;
            
                    if (!userEmail) {
                        return res.status(400).json({ message: 'userEmail is required' });
                    }
            
                    let deletedCartEntries;
                    if (courseCode) {
                        // Delete specific course entry for the user
                        deletedCartEntries = await Cart.findOneAndDelete({ userEmail, courseCode });
                        if (!deletedCartEntries) {
                            return res.status(404).json({ message: 'Cart entry not found' });
                        }
                    } else {
                        // Delete all cart entries for the user
                        deletedCartEntries = await Cart.deleteMany({ userEmail });
                        if (deletedCartEntries.deletedCount === 0) {
                            return res.status(404).json({ message: 'No cart entries found for the user' });
                        }
                    }
            
                    return res.status(200).json({ message: 'Cart entry(ies) deleted successfully' });
                } catch (err) {
                    return res.status(500).json({ message: 'Failed to delete cart entry(ies)', error: err.message });
                }
            
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
};
