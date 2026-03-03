const Report = require('../models/Report');
const { getRiskLevel, getRiskScore } = require('../services/riskService');

// GET /api/candidates - List all unique candidates with stats
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Report.aggregate([
            {
                $group: {
                    _id: '$candidateName',
                    count: { $sum: 1 },
                    counties: { $addToSet: '$county' },
                    misuseTypes: { $addToSet: '$misuseType' },
                    lastReported: { $max: '$createdAt' },
                },
            },
            { $sort: { count: -1 } },
        ]);

        const result = candidates.map((c) => ({
            candidateName: c._id,
            reportCount: c.count,
            riskLevel: getRiskLevel(c.count),
            riskScore: getRiskScore(c.count),
            counties: c.counties,
            misuseTypes: c.misuseTypes,
            lastReported: c.lastReported,
        }));

        res.status(200).json({ success: true, count: result.length, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/candidates/:name - Full candidate profile
const getCandidateProfile = async (req, res) => {
    try {
        const name = decodeURIComponent(req.params.name);

        const reports = await Report.find({
            candidateName: { $regex: `^${name}$`, $options: 'i' },
        }).sort({ createdAt: -1 });

        if (reports.length === 0) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        // Timeline: group by month
        const timeline = await Report.aggregate([
            { $match: { candidateName: { $regex: `^${name}$`, $options: 'i' } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $project: {
                    period: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            {
                                $cond: [
                                    { $lt: ['$_id.month', 10] },
                                    { $concat: ['0', { $toString: '$_id.month' }] },
                                    { $toString: '$_id.month' },
                                ],
                            },
                        ],
                    },
                    count: 1,
                    _id: 0,
                },
            },
        ]);

        // By misuse type for this candidate
        const byType = await Report.aggregate([
            { $match: { candidateName: { $regex: `^${name}$`, $options: 'i' } } },
            { $group: { _id: '$misuseType', count: { $sum: 1 } } },
            { $project: { type: '$_id', count: 1, _id: 0 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                candidateName: name,
                reportCount: reports.length,
                riskLevel: getRiskLevel(reports.length),
                riskScore: getRiskScore(reports.length),
                timeline,
                byType,
                reports,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllCandidates, getCandidateProfile };
