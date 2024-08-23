import connect from '../../utils/db';
import WishList from '../../model/WishList';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    await connect();

    switch (req.method) {
        case 'POST':
            try {
                const { email, courseTitle, courseCode, instructor, description, price, imageUrl, overview, requirements, whatWeWillLearn } = req.body;

                if (!email || !courseTitle || !courseCode || !instructor || !description || !price) {
                    return res.status(400).json({ message: 'Missing required fields' });
                }

                const existingEntry = await WishList.findOne({ email, courseCode });

                if (existingEntry) {
                    return res.status(400).json({ message: 'This course is already in the wishlist' });
                }

                const newWishListEntry = new WishList({
                    email,
                    courseTitle,
                    courseCode,
                    instructor,
                    description,
                    price,
                    imageUrl,
                    overview,          // Add overview
                    requirements,     // Add requirements
                    whatWeWillLearn    // Add whatWeWillLearn
                });

                await newWishListEntry.save();
                return res.status(201).json({ message: 'Course added to wishlist successfully', wishListEntry: newWishListEntry });
            } catch (err) {
                console.error('Error adding course to wishlist:', err);
                return res.status(500).json({ message: 'Failed to add course to wishlist', error: err.message });
            }

        case 'GET':
            try {
                const { email } = req.query;

                if (!email) {
                    return res.status(400).json({ message: 'Email query parameter is required' });
                }

                const wishListEntries = await WishList.find({ email });

                return res.status(200).json(wishListEntries.length ? wishListEntries : { message: 'No wishlist entries found' });
            } catch (err) {
                console.error('Error fetching wishlist entries:', err);
                return res.status(500).json({ message: 'Failed to fetch wishlist entries', error: err.message });
            }

        case 'DELETE':
            try {
                const { email, courseCode } = req.body;
                console.log("email and course code: ",email, courseCode);

                if (!email || !courseCode) {
                    return res.status(400).json({ message: 'Email and courseCode are required' });
                }

                const deletedWishListEntry = await WishList.findOneAndDelete({ email, courseCode });

                if (!deletedWishListEntry) {
                    return res.status(404).json({ message: 'Wishlist entry not found' });
                }

                return res.status(200).json({ message: 'Wishlist entry deleted successfully' });
            } catch (err) {
                console.error('Error deleting wishlist entry:', err);
                return res.status(500).json({ message: 'Failed to delete wishlist entry', error: err.message });
            }

        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
};
