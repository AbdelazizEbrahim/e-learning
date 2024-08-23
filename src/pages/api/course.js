import Course from '../../model/Course';
import connect from '../../utils/db';

// Helper function to handle errors
const handleError = (res, error, message) => {
    console.error(message, error);
    return res.status(500).json({ message });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    await connect();

    console.log(`Request Method: ${req.method}`);
    console.log('Request Body:', req.body);
    console.log('Request Query:', req.query);

    try {
        switch (req.method) {
            case 'POST':
                const { 
                    courseTitle, 
                    courseCode, 
                    instructor, 
                    description, 
                    price, 
                    imageUrl, 
                    overview, 
                    requirements, 
                    whatWeWillLearn 
                } = req.body;

                console.log('POST Request Body:', { 
                    courseTitle, 
                    courseCode, 
                    instructor, 
                    description, 
                    price, 
                    imageUrl, 
                    overview, 
                    requirements, 
                    whatWeWillLearn 
                });

                const existingCourse = await Course.findOne({ courseCode });
                console.log('Existing Course:', existingCourse);

                if (existingCourse) {
                    return res.status(400).json({ message: 'Course already exists' });
                }

                const newCourse = new Course({ 
                    courseTitle, 
                    courseCode, 
                    instructor, 
                    description, 
                    price, 
                    imageUrl, 
                    overview, 
                    requirements, 
                    whatWeWillLearn 
                });
                
                await newCourse.save();
                console.log('New Course Saved:', newCourse);
                return res.status(201).json({ message: 'Course added successfully' });

            case 'PUT':
                const { courseCode: updateCourseCode, isApproved } = req.body;

                console.log('PUT Request Body:', { 
                    courseCode: updateCourseCode, 
                    isApproved 
                });

                // Check if courseCode and isApproved are provided
                if (updateCourseCode && typeof isApproved === 'boolean') {
                    const updatedCourseApproval = await Course.findOneAndUpdate(
                        { courseCode: updateCourseCode },
                        { isApproved },
                        { new: true }
                    );
                    console.log('Updated Course Approval:', updatedCourseApproval);

                    if (!updatedCourseApproval) {
                        return res.status(404).json({ message: 'Course not found' });
                    }

                    return res.status(200).json({ message: 'Course approval status updated successfully' });
                }

                // Fallback to other updates if courseCode and isApproved are not provided
                const { 
                    courseTitle: updatedCourseTitle, 
                    instructor: updatedInstructor, 
                    description: updatedDescription, 
                    price: updatedPrice, 
                    imageUrl: updatedImageUrl, 
                    overview: updatedOverview, 
                    requirements: updatedRequirements, 
                    whatWeWillLearn: updatedWhatWeWillLearn 
                } = req.body;

                const updatedCourse = await Course.findOneAndUpdate(
                    { courseCode: updateCourseCode },
                    { 
                        courseTitle: updatedCourseTitle, 
                        instructor: updatedInstructor, 
                        description: updatedDescription, 
                        price: updatedPrice, 
                        imageUrl: updatedImageUrl, 
                        overview: updatedOverview, 
                        requirements: updatedRequirements, 
                        whatWeWillLearn: updatedWhatWeWillLearn 
                    },
                    { new: true }
                );

                if (!updatedCourse) {
                    return res.status(404).json({ message: 'Course not found' });
                }

                return res.status(200).json({ message: 'Course updated successfully' });

            case 'DELETE':
                const { courseCode: deleteCourseCode } = req.body;
                console.log('DELETE Request Body:', { courseCode: deleteCourseCode });

                if (!deleteCourseCode) {
                    return res.status(400).json({ message: 'Course code is required' });
                }

                const deletedCourse = await Course.findOneAndDelete({ courseCode: deleteCourseCode });
                console.log('Deleted Course:', deletedCourse);

                if (!deletedCourse) {
                    return res.status(404).json({ message: 'Course not found' });
                }

                return res.status(200).json({ message: 'Course deleted successfully' });

            case 'GET':
                const { courseCode: getCourseCode, instructor: getInstructor } = req.query;
                console.log('GET Query:', { courseCode: getCourseCode, instructor: getInstructor });

                if (getCourseCode) {
                    const course = await Course.findOne({ courseCode: getCourseCode });
                    console.log('Fetched Course:', course);

                    if (!course) {
                        return res.status(404).json({ message: 'Course not found' });
                    }

                    return res.status(200).json(course);
                } else if (getInstructor) {
                    const coursesByInstructor = await Course.find({ instructor: getInstructor });
                    console.log(`Courses by ${getInstructor}:`, coursesByInstructor);

                    if (!coursesByInstructor.length) {
                        return res.status(404).json({ message: 'No courses found for this instructor' });
                    }

                    return res.status(200).json(coursesByInstructor);
                } else {
                    const allCourses = await Course.find();
                    console.log('All Courses:', allCourses);
                    return res.status(200).json(allCourses);
                }

            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        handleError(res, error, 'An error occurred while processing the request');
    }
};
