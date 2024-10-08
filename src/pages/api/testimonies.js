import Testimony from '@/model/Testimony';
import connect from '@/utils/db';

const handleError = (res, error, message) => {
    console.error(message, error);
    return res.status(500).json({ message });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    await connect();

    try {
        switch (req.method) {
            case 'POST': {
                const { Name, testimony, imageUrl } = req.body;
                console.log("info: ", Name);
                if (!Name || !testimony || !imageUrl) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                const existingTestimony = await Testimony.findOne({ Name });
                console.log("info: ", Name);
                if (existingTestimony) {
                    return res.status(409).json({ message: 'Testimony with this name already exists' });
                }

                try {
                    const newTestimony = await Testimony.create({ Name, testimony, imageUrl });
                    return res.status(201).json({ message: 'Testimony added successfully', data: newTestimony });
                } catch (creationError) {
                    return res.status(500).json({ message: 'Error creating new Testimony' });
                }
            }
            case 'PUT': {
                const { Name, testimony, imageUrl } = req.body;

                if (!Name) {
                    return res.status(400).json({ message: 'Name is required' });
                }

                const updatedTestimony = await Testimony.findOneAndUpdate(
                    { Name },
                    { testimony, imageUrl },
                    { new: true, runValidators: true }
                );

                if (!updatedTestimony) {
                    return res.status(404).json({ message: 'Testimony not found' });
                }

                return res.status(200).json({ message: 'Testimony updated successfully', data: updatedTestimony });
            }
            case 'DELETE': {
                const { name } = req.query;
            
                if (!name) {
                    return res.status(400).json({ message: 'Name is required' });
                }
            
                const deletedTestimony = await Testimony.findOneAndDelete({ Name: name });
            
                if (!deletedTestimony) {
                    return res.status(404).json({ message: 'Testimony not found' });
                }
            
                return res.status(200).json({ message: 'Testimony deleted successfully' });
            }
            
            case 'GET': {
                const { Name, limit, createdBy } = req.query;

                let query = {};
                let options = {};

                if (Name) {
                    query.Name = Name;
                }

                if (createdBy) {
                    query.createdBy = createdBy;
                }

                if (limit) {
                    options.limit = parseInt(limit);
                }

                const testimonies = await Testimony.find(query, null, options).sort({ createdAt: -1 });

                if (Name && testimonies.length === 0) {
                    return res.status(404).json({ message: 'Testimony not found' });
                }

                return res.status(200).json(testimonies);
            }
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        handleError(res, error, 'An error occurred while processing the request');
    }
};
