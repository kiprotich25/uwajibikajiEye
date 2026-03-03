const express = require('express');
const router = express.Router();
const { getAllCandidates, getCandidateProfile } = require('../controllers/candidateController');

router.get('/', getAllCandidates);
router.get('/:name', getCandidateProfile);

module.exports = router;
