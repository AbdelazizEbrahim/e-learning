import connect from '../../utils/db'; 
import Enrollment from '../../model/Enrollment';
import User from '../../model/User';
import nodemailer from 'nodemailer';

async function notifyAdmins(subject, message) {
    try {
        const admins = await User.find({ role: 'admin' });

        if (!admins.length) {
            console.log('No admins found');
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',  
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        const adminEmails = admins.map(admin => admin.email);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,  
            to: adminEmails,  
            subject: subject, 
            text: message, 
        });

        console.log('Email notifications sent to admins');
    } catch (error) {
        console.error('Error sending email notifications:', error);
    }
}

export default async function handler(req, res) {
    await connect(); // Connect to the database

    if (req.method === 'POST') {
        // Handle POST request (Create new enrollment)
        const latestOrder = await Enrollment.findOne().sort({ orderNumber: -1 });
        const orderNumber = latestOrder ? latestOrder.orderNumber + 1 : 1;
        try {
            const {
                userEmail,
                courseTitle,
                courseCode,
                instructor,
                description,
                price,
                imageUrl,
                overview,
                requirements,
                whatWeWillLearn,
                paymentId,
                paymentStatus,
                status,
                paymentVia,
                createdAt
            } = req.body;

            // Log the received data
            console.log("Received:", req.body);

            // Validate required fields
            if (!userEmail || !courseCode || !courseTitle) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            // Create a new enrollment entry
            const newEnrollment = new Enrollment({
                userEmail,
                courseTitle,
                courseCode,
                instructor,
                description,
                price,
                imageUrl,
                overview,
                requirements,
                whatWeWillLearn,
                orderNumber,
                paymentId,
                paymentStatus,
                status,
                paymentVia,
                createdAt: createdAt || new Date(), // Use provided createdAt or default to now
            });

            // Save the enrollment entry to the database
            console.log("new enrollment: ", newEnrollment);
            console.log("saving ...");
            await newEnrollment.save();
            console.log("New enrollment created:", newEnrollment);

            return res.status(201).json({ message: 'Enrollment created successfully', data: newEnrollment });
        } catch (error) {
            console.error("Error creating enrollment:", error);
            return res.status(500).json({ message: 'Failed to create enrollment', error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const { userEmail, courseCode, paymentStatus } = req.query;

            // Build the query object
            let query = {};
            if (userEmail) query.userEmail = userEmail;
            if (courseCode) query.courseCode = courseCode;
            if (paymentStatus) query.paymentStatus = paymentStatus;

            console.log("Query parameters:", query);

            // Fetch enrollments based on query
            const enrollments = await Enrollment.find(query);

            if (enrollments.length > 0) {
                console.log("Enrollments found:", enrollments);
                return res.status(200).json({ message: 'Enrollments retrieved successfully', data: enrollments });
            } else {
                console.log("No enrollments found for the given query.");
                return res.status(404).json({ message: 'No enrollments found' });
            }
        } catch (error) {
            console.error("Error fetching enrollments:", error);
            return res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
        }
    } if (req.method === 'PUT') {
        try {
            const { userEmail, paymentStatus } = req.body;

            // Update the paymentStatus for the specified userEmail
            const updateEnrollment = await Enrollment.updateMany(
                { userEmail }, 
                { $set: { paymentStatus } }, 
                { new: true } 
            );

            if (updateEnrollment.matchedCount === 0) {
                console.log("No entries found to update");
                return res.status(404).json({ message: "No entries found to update" });
            }

            console.log("Updated Enrollment:", updateEnrollment);

            // If paymentStatus is updated to "PAID", notify admins
            if (paymentStatus === 'PAID') {
                const enrollments = await Enrollment.find({ userEmail, paymentStatus: 'PAID' });

                // Prepare the message with course details
                const courseDetails = enrollments.map(enrollment => 
                    `Course Code: ${enrollment.courseCode}, Price: ${enrollment.price}`).join('\n');
                
                const message = `User with email ${userEmail} has purchased the following courses:\n${courseDetails}`;
                
                await notifyAdmins('New Course Purchase', message);
            }

            return res.status(200).json({ message: "Enrollment updated successfully" });
        } catch (err) {
            console.error("Failed to update entries:", err.message);
            return res.status(500).json({ message: 'Failed to update enrollment', error: err.message });
        }
    }  else if (req.method === 'DELETE'){
                try {
                    const { userEmail, courseCode } = req.query;
            
                    if (!userEmail) {
                        return res.status(400).json({ message: 'userEmail is required' });
                    }
            
                    let deletedCartEntries;
                    if (courseCode) {
                        // Delete specific course entry for the user
                        deletedCartEntries = await Enrollment.findOneAndDelete({ userEmail, courseCode });
                        if (!deletedCartEntries) {
                            return res.status(404).json({ message: 'Cart entry not found' });
                        }
                    } else {
                        // Delete all cart entries for the user
                        deletedCartEntries = await Enrollment.deleteMany({ userEmail });
                        if (deletedCartEntries.deletedCount === 0) {
                            return res.status(404).json({ message: 'No cart entries found for the user' });
                        }
                    }
            
                    return res.status(200).json({ message: 'Cart entry(ies) deleted successfully' });
                } catch (err) {
                    return res.status(500).json({ message: 'Failed to delete cart entry(ies)', error: err.message });
                }
    }
    
    else  {
        // Method not allowed
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
