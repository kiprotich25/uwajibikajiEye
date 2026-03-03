const Report = require('../models/Report');
const { getRiskLevel } = require('../services/riskService');

// In-memory USSD session store (use Redis in production)
const sessions = {};

/**
 * Africa's Talking USSD handler
 * POST /api/ussd
 * Body: sessionId, serviceCode, phoneNumber, text
 */
const handleUSSD = async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';
    const input = text ? text.trim() : '';
    const parts = input.split('*');

    // Initialize session if new
    if (!sessions[sessionId]) {
        sessions[sessionId] = { data: {} };
    }
    const session = sessions[sessionId];

    try {
        // Level 0: Main menu
        if (input === '') {
            response = `CON Welcome to Uwajibikaji-Eye 👁️\nTracking Public Resource Misuse\n\n1. Report Misuse\n2. View Summary\n3. Exit`;
        }
        // Level 1: User selected from main menu
        else if (parts.length === 1) {
            const choice = parts[0];

            if (choice === '1') {
                response = 'CON Enter candidate name:';
            } else if (choice === '2') {
                // Fetch summary
                const total = await Report.countDocuments();
                const highRisk = await Report.aggregate([
                    { $group: { _id: '$candidateName', count: { $sum: 1 } } },
                    { $match: { count: { $gte: 6 } } },
                    { $count: 'highRiskCount' },
                ]);
                const hrCount = highRisk.length > 0 ? highRisk[0].highRiskCount : 0;
                response = `END 📊 Uwajibikaji-Eye Summary\n\nTotal Reports: ${total}\nHigh Risk Candidates: ${hrCount}\n\nDial again to report or check.`;
            } else if (choice === '3') {
                // Clean up session
                delete sessions[sessionId];
                response = 'END Thank you for using Uwajibikaji-Eye. Goodbye! 🙏';
            } else {
                response = 'CON Invalid choice.\n1. Report Misuse\n2. View Summary\n3. Exit';
            }
        }
        // Level 2: Candidate name entered for reporting (1*<name>)
        else if (parts.length === 2 && parts[0] === '1') {
            session.data.candidateName = parts[1];
            response = `CON Misuse type for ${parts[1]}:\n1. Vehicle\n2. Building\n3. Funds\n4. Staff`;
        }
        // Level 3: Misuse type selected (1*<name>*<type>)
        else if (parts.length === 3 && parts[0] === '1') {
            const typeMap = { '1': 'vehicle', '2': 'building', '3': 'funds', '4': 'staff' };
            const misuseType = typeMap[parts[2]];
            if (!misuseType) {
                response = `CON Invalid type. Choose:\n1. Vehicle\n2. Building\n3. Funds\n4. Staff`;
            } else {
                session.data.misuseType = misuseType;
                response = 'CON Enter the county where this occurred:';
            }
        }
        // Level 4: County entered - save report (1*<name>*<type>*<county>)
        else if (parts.length === 4 && parts[0] === '1') {
            session.data.county = parts[3];

            const report = new Report({
                candidateName: session.data.candidateName,
                misuseType: session.data.misuseType,
                county: session.data.county,
                description: `Reported via USSD from ${phoneNumber}`,
                source: 'ussd',
                phoneNumber: phoneNumber,
            });

            await report.save();
            delete sessions[sessionId];

            response = `END ✅ Report Submitted!\n\nCandidate: ${session.data.candidateName}\nType: ${session.data.misuseType}\nCounty: ${session.data.county}\n\nThank you for holding leaders accountable!`;
        } else {
            response = 'END Session expired. Please dial again.';
            delete sessions[sessionId];
        }
    } catch (error) {
        console.error('USSD Error:', error.message);
        response = 'END An error occurred. Please try again later.';
        delete sessions[sessionId];
    }

    // Africa's Talking expects plain text response
    res.set('Content-Type', 'text/plain');
    res.send(response);
};

module.exports = { handleUSSD };
