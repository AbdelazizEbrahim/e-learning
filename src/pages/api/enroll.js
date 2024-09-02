// import Student from '../../model/Student';
// import connect from '../../utils/db';

// // eslint-disable-next-line import/no-anonymous-default-export
// export default async (req, res) => {
//   await connect();

//   if (req.method === 'GET') {
//     try { 
//       const enrolledStudents = await Student.find({});
//       console.log("Total number of enrolled students are: " + enrolledStudents.length);
//       console.log(enrolledStudents)
//       return res.status(200).json({ message: "Successfully Fetched", data: enrolledStudents });
//     } catch (err) {
//       console.error("Error while fetching students: " + err.message);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   } else if (req.method === 'POST') {
//     try {
//       console.log("Handling POST request for adding a student");
//       const { studentName, fatherName, studentId, city, courseCode } = req.body;
//       console.log(`Received Student data: Name=${studentName}, Father Name=${fatherName}, ID=${studentId}, City=${city}, Course=${courseCode}`);

//       const existingStudent = await Student.findOne({ studentId, courseCode });

//       if (existingStudent) {
//         console.log("Student already exists with the given ID:", courseCode);
//         return res.status(400).json({ message: 'Student already exists' });
//       } else {
//         const newStudent = new Student({ studentName, fatherName, studentId, city, courseCode });
//         await newStudent.save();
//         console.log("New Student enrolled successfully:", newStudent);
//         return res.status(201).json({ message: 'Student added successfully' });
//       }
//     } catch (err) {
//       console.error("Internal server error while enrolling:", err.message);
//       return res.status(500).json({ message: err.message });
//     }
//   } else {
//     // Method Not Allowed
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }
// };
