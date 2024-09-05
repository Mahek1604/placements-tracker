// interviewController.js

const nodemailer = require("nodemailer");
const interviewModel = require("../models/interviewModel");
const studentModel = require("../models/studentModel");
const config = require("../config");

// Create a new interview
exports.createInterview = async (req, res) => {
    try {
        const { studentId, companyId, interviewDate, slot } = req.body;

        // Create interview object
        const interview = {
            studentId,
            companyId,
            interviewDate: new Date(interviewDate),
            slot,
        };

        // Insert into the database
        await interviewModel.insertOne(interview);

        // Get student details
        const student = await studentModel.findOne({ _id: studentId });

        // Schedule interview reminder email
        const oneDayBeforeInterview = new Date(interviewDate);
        oneDayBeforeInterview.setDate(oneDayBeforeInterview.getDate() - 1);

        // Send email one day before the interview
        setTimeout(() => {
            scheduleInterviewReminder(student.email, interviewDate);
        }, oneDayBeforeInterview - Date.now());

        res.status(201).json({ message: "Interview created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error creating interview", error });
    }
};

// Get all interviews
exports.getAllInterviews = async (req, res) => {
    try {
        const interviews = await interviewModel.find().toArray();
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching interviews", error });
    }
};

// Get a specific interview by ID
exports.getInterviewById = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const interview = await interviewModel.findOne({ _id: interviewId });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({ message: "Error fetching interview", error });
    }
};

// Update an interview
exports.updateInterview = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const { studentId, companyId, interviewDate, slot } = req.body;

        const updatedInterview = {
            studentId,
            companyId,
            interviewDate: new Date(interviewDate),
            slot,
        };

        const result = await interviewModel.updateOne(
            { _id: interviewId },
            { $set: updatedInterview }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Interview not found" });
        }

        res.status(200).json({ message: "Interview updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating interview", error });
    }
};

// Delete an interview
exports.deleteInterview = async (req, res) => {
    try {
        const interviewId = req.params.id;

        const result = await interviewModel.deleteOne({ _id: interviewId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Interview not found" });
        }

        res.status(200).json({ message: "Interview deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting interview", error });
    }
};

// Schedule interview reminder email
function scheduleInterviewReminder(studentEmail, interviewDate) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.emailUser,
            pass: config.emailPass,
        },
    });

    const mailOptions = {
        from: config.emailUser,
        to: studentEmail,
        subject: "Interview Reminder",
        text: `Dear student, this is a reminder that you have an interview scheduled on ${new Date(
            interviewDate
        ).toLocaleString()}. Please be prepared.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Interview reminder email sent:", info.response);
        }
    });
}
