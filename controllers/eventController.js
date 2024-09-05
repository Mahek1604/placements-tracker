const events = require("../models/eventModel");
const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const eventList = await events.find({}).toArray();
        res.status(200).json(eventList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new event
exports.addEvent = async (req, res) => {
    const { companyName, eventType, date } = req.body;

    try {
        const count = await events.countDocuments({ date });
        if (count >= 3) {
            // Send alert email to admin
            const mailOptions = {
                from: config.emailUser,
                to: config.adminEmail,
                subject: "Recruitment Event Alert",
                text: `More than 3 companies have booked events on ${date}.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error sending email: ", error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }

        await events.insertOne({ companyName, eventType, date });
        res.status(201).json({ message: "Event added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
        await events.deleteOne({ _id: eventId });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
