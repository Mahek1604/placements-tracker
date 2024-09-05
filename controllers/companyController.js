const companies = require("../models/companyModel");

// Get all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companyList = await companies.find({}).toArray();
        res.status(200).json(companyList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific company by ID
exports.getCompanyById = async (req, res) => {
    const companyId = req.params.id;

    try {
        const company = await companies.findOne({ _id: companyId });
        if (company) {
            res.status(200).json(company);
        } else {
            res.status(404).json({ message: "Company not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new company
exports.addCompany = async (req, res) => {
    const { name, industry, contactEmail } = req.body;

    try {
        await companies.insertOne({ name, industry, contactEmail });
        res.status(201).json({ message: "Company added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update company information
exports.updateCompany = async (req, res) => {
    const companyId = req.params.id;
    const updateData = req.body;

    try {
        await companies.updateOne({ _id: companyId }, { $set: updateData });
        res.status(200).json({ message: "Company updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
    const companyId = req.params.id;

    try {
        await companies.deleteOne({ _id: companyId });
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
