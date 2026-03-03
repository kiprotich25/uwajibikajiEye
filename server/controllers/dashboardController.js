const Report = require('../models/Report');
const { getRiskLevel, getRiskScore } = require('../services/riskService');

// GET /api/dashboard - Full dashboard analytics
const getDashboardStats = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();

        // By county
        const byCounty = await Report.aggregate([
            { $group: { _id: '$county', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { county: '$_id', count: 1, _id: 0 } },
        ]);

        // By candidate
        const byCandidate = await Report.aggregate([
            { $group: { _id: '$candidateName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            {
                $project: {
                    candidateName: '$_id',
                    count: 1,
                    riskLevel: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$count', 6] }, then: 'HIGH' },
                                { case: { $gte: ['$count', 3] }, then: 'MEDIUM' },
                                { case: { $gte: ['$count', 1] }, then: 'LOW' },
                            ],
                            default: 'NONE',
                        },
                    },
                    _id: 0,
                },
            },
        ]);

        // By misuse type
        const byType = await Report.aggregate([
            { $group: { _id: '$misuseType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { type: '$_id', count: 1, _id: 0 } },
        ]);

        // High risk candidates (6+ reports)
        const highRiskCandidates = byCandidate.filter((c) => c.count >= 6);

        // By source
        const bySource = await Report.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $project: { source: '$_id', count: 1, _id: 0 } },
        ]);

        // Recent reports (last 5)
        const recentReports = await Report.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalReports,
                byCounty,
                byCandidate,
                byType,
                bySource,
                highRiskCandidates,
                recentReports,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats };
