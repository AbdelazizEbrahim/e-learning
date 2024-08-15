import Course from '../../model/Course';
import connect from '../../utils/db';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    await connect();

    switch (req.method) {
        case 'POST':
            try {
                const { courseTitle, courseCode, instructor, studentList } = req.body;
                const existingCourse = await Course.findOne({ courseCode });

                if (existingCourse) {
                    return res.status(400).json({ message: 'Course already exists' });
                }

                const newCourse = new Course({ courseTitle, courseCode, instructor, studentList });
                await newCourse.save();
                return res.status(201).json({ message: 'Course added successfully' });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to add course' });
            }

        case 'PUT':
            try {
                const { courseTitle, courseCode, instructor, studentList } = req.body;
                const updatedCourse = await Course.findOneAndUpdate(
                    { courseCode },
                    { courseTitle, instructor },
                    { new: true }
                );

                if (!updatedCourse) {
                    return res.status(404).json({ message: 'Course not found' });
                }

                return res.status(200).json({ message: 'Course updated successfully' });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to update course' });
            }

        case 'DELETE':
            try {
                const { courseCode } = req.body;

                if (!courseCode) {
                    return res.status(400).json({ message: 'Course code is required' });
                }

                const deletedCourse = await Course.findOneAndDelete({ courseCode });

                if (!deletedCourse) {
                    return res.status(404).json({ message: 'Course not found' });
                }

                return res.status(200).json({ message: 'Course deleted successfully' });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to delete course' });
            }

        case 'GET':
            try {
                const allCourses = await Course.find();
                return res.status(200).json(allCourses);
            } catch (err) {
                return res.status(500).json({ message: 'Error fetching courses' });
            }

        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
};
