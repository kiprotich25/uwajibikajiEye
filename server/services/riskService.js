/**
 * Risk scoring service for Uwajibikaji-Eye
 * 1–2 reports  → LOW
 * 3–5 reports  → MEDIUM
 * 6+  reports  → HIGH
 */

const getRiskLevel = (count) => {
    if (count >= 6) return 'HIGH';
    if (count >= 3) return 'MEDIUM';
    if (count >= 1) return 'LOW';
    return 'NONE';
};

const getRiskColor = (level) => {
    switch (level) {
        case 'HIGH':
            return '#ef4444';
        case 'MEDIUM':
            return '#f59e0b';
        case 'LOW':
            return '#22c55e';
        default:
            return '#6b7280';
    }
};

const getRiskScore = (count) => {
    // Normalized score 0-100 for UI indicator
    return Math.min(100, Math.round((count / 10) * 100));
};

module.exports = { getRiskLevel, getRiskColor, getRiskScore };
