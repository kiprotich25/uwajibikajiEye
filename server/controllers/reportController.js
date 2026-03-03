const Report = require('../models/Report');
const { getRiskLevel } = require('../services/riskService');

// POST /api/reports - Create a new report
const createReport = async (req, res) => {
    try {
        const {
            candidateName,
            misuseType,
            description,
            county,
            constituency,
            lat,
            lng,
            source,
            phoneNumber,
        } = req.body;

        const report = new Report({
            candidateName,
            misuseType,
            description,
            county,
            constituency,
            lat: lat || null,
            lng: lng || null,
            source: source || 'web',
            phoneNumber: phoneNumber || '',
        });

        const saved = await report.save();
        res.status(201).json({ success: true, data: saved });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// GET /api/reports - Get all reports
const getAllReports = async (req, res) => {
    try {
        const { county, misuseType, source } = req.query;
        const filter = {};
        if (county) filter.county = { $regex: county, $options: 'i' };
        if (misuseType) filter.misuseType = misuseType;
        if (source) filter.source = source;

        const reports = await Report.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reports.length, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/reports/:id - Get a single report
const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/reports/candidate/:name - Reports by candidate
const getReportsByCandidate = async (req, res) => {
    try {
        const name = decodeURIComponent(req.params.name);
        const reports = await Report.find({
            candidateName: { $regex: name, $options: 'i' },
        }).sort({ createdAt: -1 });

        const riskLevel = getRiskLevel(reports.length);

        res.status(200).json({
            success: true,
            candidateName: name,
            count: reports.length,
            riskLevel,
            data: reports,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/reports/:id
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        res.status(200).json({ success: true, message: 'Report deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    getReportsByCandidate,
    deleteReport,
};
