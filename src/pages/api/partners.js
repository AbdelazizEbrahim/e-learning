import Partner from '../../model/Partner';
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
                const { Name, description, imageUrl } = req.body;

                if (!Name || !description || !imageUrl) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                const existingPartner = await Partner.findOne({ Name });
                if (existingPartner) {
                    return res.status(409).json({ message: 'Partner with this name already exists' });
                }

                try {
                    const newPartner = await Partner.create({ Name, description, imageUrl });
                    return res.status(201).json({ message: 'Partner added successfully', data: newPartner });
                } catch (creationError) {
                    return res.status(500).json({ message: 'Error creating new partner' });
                }
            }
            case 'PUT': {
                const { Name, description, imageUrl } = req.body;

                if (!Name) {
                    return res.status(400).json({ message: 'Name is required' });
                }

                const updatedPartner = await Partner.findOneAndUpdate(
                    { Name },
                    { description, imageUrl },
                    { new: true, runValidators: true }
                );

                if (!updatedPartner) {
                    return res.status(404).json({ message: 'Partner not found' });
                }

                return res.status(200).json({ message: 'Partner updated successfully', data: updatedPartner });
            }
            case 'DELETE': {
                const { Name } = req.body;

                if (!Name) {
                    return res.status(400).json({ message: 'Name is required' });
                }

                const deletedPartner = await Partner.findOneAndDelete({ Name });

                if (!deletedPartner) {
                    return res.status(404).json({ message: 'Partner not found' });
                }

                return res.status(200).json({ message: 'Partner deleted successfully' });
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

                const partners = await Partner.find(query, null, options).sort({ createdAt: -1 });

                if (Name && partners.length === 0) {
                    return res.status(404).json({ message: 'Partner not found' });
                }

                return res.status(200).json(partners);
            }
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        handleError(res, error, 'An error occurred while processing the request');
    }
};
