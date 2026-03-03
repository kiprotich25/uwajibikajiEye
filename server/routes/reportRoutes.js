const express = require('express');
const router = express.Router();
const {
    createReport,
    getAllReports,
    getReportById,
    getReportsByCandidate,
    deleteReport,
} = require('../controllers/reportController');

router.post('/', createReport);
router.get('/', getAllReports);
router.get('/candidate/:name', getReportsByCandidate);
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);

module.exports = router;
