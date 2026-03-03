/**
 * Seed script — populates MongoDB with sample misuse reports for development/demo
 * Run with: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Report = require('./models/Report');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uwajibikaji-eye';

const sampleReports = [
    // High risk candidate (7 reports)
    { candidateName: 'James Parker', misuseType: 'vehicle', county: 'Nairobi', constituency: 'Starehe', lat: -1.2921, lng: 36.8219, description: 'Government Land Rover used for campaign rallies', source: 'web' },
    { candidateName: 'James Parker', misuseType: 'staff', county: 'Nairobi', constituency: 'Westlands', lat: -1.2684, lng: 36.8034, description: 'Civil servants deployed to distribute campaign T-shirts', source: 'web' },
    { candidateName: 'James Parker', misuseType: 'funds', county: 'Nairobi', constituency: 'Dagoretti', lat: -1.2967, lng: 36.7527, description: 'Bursary funds used as campaign bribe', source: 'ussd' },
    { candidateName: 'James Parker', misuseType: 'vehicle', county: 'Kiambu', constituency: 'Kikuyu', lat: -1.2106, lng: 36.7817, description: 'County ambulance seen at political rally', source: 'ussd' },
    { candidateName: 'James Parker', misuseType: 'building', county: 'Nairobi', constituency: 'Kasarani', lat: -1.2209, lng: 36.8978, description: 'Public health center used as campaign headquarters', source: 'web' },
    { candidateName: 'James Parker', misuseType: 'funds', county: 'Nairobi', constituency: 'Embakasi', lat: -1.3178, lng: 36.8999, description: 'Ward development funds redirected to political ads', source: 'web' },
    { candidateName: 'James Parker', misuseType: 'staff', county: 'Machakos', constituency: 'Mavoko', lat: -1.3641, lng: 36.9802, description: 'County officers used for voter registration drives', source: 'ussd' },

    // Medium risk (4 reports)
    { candidateName: 'Grace Adams', misuseType: 'vehicle', county: 'Mombasa', constituency: 'Nyali', lat: -4.0435, lng: 39.6682, description: 'Coast Guard vehicles spotted at political rally', source: 'web' },
    { candidateName: 'Grace Adams', misuseType: 'building', county: 'Mombasa', constituency: 'Kisauni', lat: -3.9958, lng: 39.7071, description: 'Port authority boardroom used for campaign meetings', source: 'web' },
    { candidateName: 'Grace Adams', misuseType: 'funds', county: 'Kilifi', constituency: 'Malindi', lat: -3.2138, lng: 40.1169, description: 'Education bursary fund misappropriated', source: 'ussd' },
    { candidateName: 'Grace Adams', misuseType: 'staff', county: 'Kwale', constituency: 'Matuga', lat: -4.1748, lng: 39.4522, description: 'Government staff ordered to attend rally', source: 'web' },

    // Medium risk (3 reports)
    { candidateName: 'Peter Scott', misuseType: 'funds', county: 'Nakuru', constituency: 'Nakuru Town', lat: -0.3031, lng: 36.0800, description: 'Public health funds diverted', source: 'web' },
    { candidateName: 'Peter Scott', misuseType: 'vehicle', county: 'Nakuru', constituency: 'Rongai', lat: -0.1667, lng: 36.0333, description: 'County school buses used to ferry supporters', source: 'ussd' },
    { candidateName: 'Peter Scott', misuseType: 'staff', county: 'Baringo', constituency: 'Baringo Central', lat: 0.4667, lng: 35.9667, description: 'County workers forced to attend campaign event', source: 'web' },

    // Low risk (2 reports)
    { candidateName: 'Mary Kimberly', misuseType: 'building', county: 'Kisumu', constituency: 'Kisumu East', lat: -0.0917, lng: 34.7680, description: 'Government offices used after hours for planning', source: 'web' },
    { candidateName: 'Mary Kimberly', misuseType: 'vehicle', county: 'Siaya', constituency: 'Gem', lat: 0.0607, lng: 34.2922, description: 'Official pickup used for campaign posters', source: 'ussd' },

    // Low risk (1 report)
    { candidateName: 'Samuel Jackson', misuseType: 'funds', county: 'Uasin Gishu', constituency: 'Ainabkoi', lat: 0.5167, lng: 35.2667, description: 'Constituency development funds query', source: 'web' },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Report.deleteMany({});
        console.log('🗑️  Cleared existing reports');

        const created = await Report.insertMany(sampleReports);
        console.log(`✅ Seeded ${created.length} reports`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
