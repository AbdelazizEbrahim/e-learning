import task from '../model/task';
import connect from '../utils/db';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, response) => {
    await connect();

    if (request.method === 'POST') {
        try {
            const { title, description, dueDate, priority, category } = request.body;
            const existingTask = await tasks.findOne({ title });

            if (existingTask) {
                console.log("Task already exists");
                return response.status(400).json({ message: 'Task already exists' });
            } else {
                const newTask = new tasks({ title, description, dueDate, priority, category });
                await newTask.save();
                console.log("Task added successfully");
                return response.status(201).json({ message: 'Task added successfully' });
            }
        } catch (err) {
            console.error("Internal server error while adding task:", err);
            return response.status(500).json({ message: 'Failed to add task' });
        }
    } else if (request.method === 'PUT') {
        try {
            const { title, description, dueDate, priority, category } = request.body;
            const update = { description, dueDate, priority, category };
            const filter = { title };
            const options = { new: true }; // 'options' should be 'options'
            const updateTask = await tasks.findOneAndUpdate(filter, update, options);

            if (!updateTask) {
                console.log("Task not updated");
                return response.status(404).json({ message: 'Task not found' });
            } else {
                console.log("Task updated successfully");
                return response.status(200).json({ message: 'Task updated successfully' });
            }
        } catch (err) {
            console.error("Internal server error while updating task:", err);
            return response.status(500).json({ message: 'Failed to update task' });
        }
    } else if (request.method === 'DELETE') {
        try {
            const { title } = request.body;
            const deleteTask = await tasks.findOneAndDelete({ title });

            if (!deleteTask) {
                console.log("Task not found for deletion");
                return response.status(404).json({ message: 'Task not found' });
            } else {
                console.log("Task deleted successfully");
                return response.status(200).json({ message: 'Task deleted successfully' });
            }
        } catch (err) {
            console.error("Internal server error while deleting task:", err);
            return response.status(500).json({ message: 'Failed to delete task' });
        }
    } else if (request.method === 'GET') {
        try {
            const allTasks = await tasks.find();
            console.log("All tasks fetched successfully");
            return response.status(200).json({ tasks: allTasks });
        } catch (err) {
            console.error("Error fetching tasks:", err);
            return response.status(500).json({ message: 'Error fetching tasks' });
        }
    } else {
        return response.status(405).json({ message: 'Method not allowed' });
    }
}
