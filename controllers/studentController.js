const students = require("../models/studentModel");

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const studentList = await students.find({}).toArray();
        res.status(200).json(studentList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific student by ID
exports.getStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await students.findOne({ _id: studentId });
        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new student
exports.addStudent = async (req, res) => {
    const { name, email, department, placed } = req.body;

    try {
        await students.insertOne({ name, email, department, placed: placed || false });
        res.status(201).json({ message: "Student added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update student information
exports.updateStudent = async (req, res) => {
    const studentId = req.params.id;
    const updateData = req.body;

    try {
        await students.updateOne({ _id: studentId }, { $set: updateData });
        res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    const studentId = req.params.id;

    try {
        await students.deleteOne({ _id: studentId });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
