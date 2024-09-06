import nodemailer from 'nodemailer';
import Course from '../../model/Course';
import User from '../../model/User';
import connect from '../../utils/db';

const handleError = (res, error, message) => {
    console.error(message, error);
    return res.status(500).json({ message });
};

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

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    await connect();

    let updateCourseCode, isApproved, isHome, imageUrl, courseTitle, price, overview, requirements, whatWeWillLearn, description;
    let deleteCourseCode;
    let getCourseCode, getInstructor, getIsHome;

    try {
        switch (req.method) {
            case 'POST':
                const { 
                    courseTitle: postCourseTitle, 
                    courseCode: postCourseCode, 
                    instructor: postInstructor, 
                    description: postDescription, 
                    price: postPrice, 
                    imageUrl: postImageUrl, 
                    overview: postOverview, 
                    requirements: postRequirements, 
                    whatWeWillLearn: postWhatWeWillLearn 
                } = req.body;

                const existingCourse = await Course.findOne({ courseCode: postCourseCode });
                if (existingCourse) {
                    return res.status(400).json({ message: 'Course already exists' });
                }

                const newCourse = new Course({ 
                    courseTitle: postCourseTitle, 
                    courseCode: postCourseCode, 
                    instructor: postInstructor, 
                    description: postDescription, 
                    price: postPrice, 
                    imageUrl: postImageUrl, 
                    overview: postOverview, 
                    requirements: postRequirements, 
                    whatWeWillLearn: postWhatWeWillLearn 
                });
                
                await newCourse.save();
                const message = `A new course titled "${postCourseTitle}" has been created by ${postInstructor}.`;
                await notifyAdmins('New Course Created', message);

                return res.status(201).json({ message: 'Course added successfully' });

            case 'PUT':
                ({ 
                    courseCode: updateCourseCode, 
                    isApproved, 
                    isHome, 
                    imageUrl, 
                    courseTitle, 
                    price, 
                    overview, 
                    requirements, 
                    whatWeWillLearn, 
                    description 
                } = req.body);

                if (updateCourseCode) {
                    const updateData = {
                        isApproved,
                        isHome,
                        imageUrl,
                        courseTitle,
                        price,
                        overview,
                        requirements,
                        whatWeWillLearn,
                        description
                    };

                    try {
                        const updatedCourse = await Course.findOneAndUpdate(
                            { courseCode: updateCourseCode },
                            updateData,
                            { new: true }
                        );

                        if (!updatedCourse) {
                            return res.status(404).json({ message: 'Course not found' });
                        }

                        return res.status(200).json({ message: 'Course updated successfully' });
                    } catch (error) {
                        console.error('Error updating course:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                } else {
                    return res.status(400).json({ message: 'Course code is required' });
                }

            case 'DELETE':
                ({ courseCode: deleteCourseCode } = req.body);

                if (!deleteCourseCode) {
                    return res.status(400).json({ message: 'Course code is required' });
                }

                const deletedCourse = await Course.findOneAndDelete({ courseCode: deleteCourseCode });

                if (!deletedCourse) {
                    return res.status(404).json({ message: 'Course not found' });
                }

                return res.status(200).json({ message: 'Course deleted successfully' });

            case 'GET':
                ({ 
                    courseCode: getCourseCode, 
                    instructor: getInstructor, 
                    isHome: getIsHome 
                } = req.query);

                if (getCourseCode) {
                    try {
                        const course = await Course.findOne({ courseCode: getCourseCode });

                        if (!course) {
                            return res.status(404).json({ message: 'Course not found' });
                        }

                        return res.status(200).json(course);
                    } catch (error) {
                        console.error('Error fetching course:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                } 

                if (getInstructor) {
                    try {
                        const coursesByInstructor = await Course.find({ instructor: getInstructor });

                        if (!coursesByInstructor.length) {
                            return res.status(404).json({ message: 'No courses found for this instructor' });
                        }

                        return res.status(200).json(coursesByInstructor);
                    } catch (error) {
                        console.error('Error fetching courses by instructor:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                } 

                if (getIsHome === 'true') {
                    try {
                        const homeCourses = await Course.find({ isHome: true });

                        if (!homeCourses.length) {
                            return res.status(404).json({ message: 'No courses found for the home page' });
                        }

                        return res.status(200).json(homeCourses);
                    } catch (error) {
                        console.error('Error fetching home courses:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                }

                try {
                    const allCourses = await Course.find();
                    return res.status(200).json(allCourses);
                } catch (error) {
                    console.error('Error fetching all courses:', error);
                    return res.status(500).json({ message: 'Internal server error' });
                }

            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        handleError(res, error, 'An error occurred while processing the request');
    }
};
