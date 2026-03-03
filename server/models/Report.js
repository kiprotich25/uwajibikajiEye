const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        candidateName: {
            type: String,
            required: [true, 'Candidate name is required'],
            trim: true,
        },
        misuseType: {
            type: String,
            enum: ['vehicle', 'building', 'funds', 'staff'],
            required: [true, 'Misuse type is required'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        county: {
            type: String,
            required: [true, 'County is required'],
            trim: true,
        },
        constituency: {
            type: String,
            trim: true,
            default: '',
        },
        lat: {
            type: Number,
            default: null,
        },
        lng: {
            type: Number,
            default: null,
        },
        source: {
            type: String,
            enum: ['web', 'ussd'],
            default: 'web',
        },
        phoneNumber: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster candidate lookups
reportSchema.index({ candidateName: 1 });
reportSchema.index({ county: 1 });
reportSchema.index({ misuseType: 1 });

module.exports = mongoose.model('Report', reportSchema);
