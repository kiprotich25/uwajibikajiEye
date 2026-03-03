import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line,
} from 'recharts';
import { getCandidateProfile } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import StatCard from '../components/StatCard';

const MISUSE_ICONS = { vehicle: '🚗', building: '🏛️', funds: '💰', staff: '👥' };
const MISUSE_COLORS = { vehicle: '#ef4444', building: '#f59e0b', funds: '#22c55e', staff: '#3b82f6' };

export default function CandidatePage() {
    const { name } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getCandidateProfile(name)
            .then((res) => setProfile(res.data.data))
            .catch((err) => setError(err.response?.data?.message || 'Failed to load candidate profile'))
            .finally(() => setLoading(false));
    }, [name]);

    if (loading) return (
        <div className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400">Loading profile…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="pt-20 min-h-screen flex items-center justify-center text-center">
            <div>
                <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
                <Link to="/candidates" className="btn-secondary text-sm">← Back to Candidates</Link>
            </div>
        </div>
    );

    const { candidateName, reportCount, riskLevel, riskScore, timeline, byType, reports } = profile;

    const typeData = byType.map((t) => ({
        name: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        count: t.count,
        fill: MISUSE_COLORS[t.type] || '#ef4444',
    }));

    return (
        <div className="pt-20 min-h-screen">
            {/* Header */}
            <div className={`relative border-b border-border/50 py-10 overflow-hidden ${riskLevel === 'HIGH' ? 'bg-gradient-to-r from-red-900/30 to-transparent' :
                    riskLevel === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-900/20 to-transparent' :
                        'bg-gradient-to-r from-green-900/15 to-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/candidates" className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1 mb-4">
                        ← Back to Candidates
                    </Link>

                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-bold text-white">
                                {candidateName.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{candidateName}</h1>
                                <p className="text-slate-400 text-sm mt-0.5">{reportCount} incident{reportCount !== 1 ? 's' : ''} reported</p>
                            </div>
                        </div>
                        <RiskBadge level={riskLevel} size="lg" />
                    </div>

                    {/* Risk bar */}
                    <div className="mt-6 max-w-sm">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                            <span>Risk Score</span>
                            <span className="font-medium text-slate-300">{riskScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-700 ${riskLevel === 'HIGH' ? 'bg-red-500' :
                                        riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${riskScore}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Reports" value={reportCount} icon="📋" color="red" />
                    <StatCard label="Risk Level" value={riskLevel} icon="🎯" color={riskLevel === 'HIGH' ? 'red' : riskLevel === 'MEDIUM' ? 'yellow' : 'green'} />
                    <StatCard label="Misuse Types" value={byType.length} icon="🏷️" color="blue" />
                    <StatCard
                        label="Counties"
                        value={[...new Set(reports.map((r) => r.county))].length}
                        icon="📍"
                        color="purple"
                    />
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* By Type */}
                    <section className="glass rounded-xl border border-border/50 p-6">
                        <h2 className="text-white font-semibold mb-5">Misuse by Type</h2>
                        {typeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={typeData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" />
                                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        formatter={(v) => [`${v} reports`, 'Count']}
                                        contentStyle={{ background: '#1c1c2e', border: '1px solid #2a2a40', borderRadius: '8px', color: '#e2e8f0' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {typeData.map((entry, index) => (
                                            <Bar key={index} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <p className="text-slate-500 text-center py-10">No data</p>}
                    </section>

                    {/* Timeline */}
                    <section className="glass rounded-xl border border-border/50 p-6">
                        <h2 className="text-white font-semibold mb-5">Reports Timeline</h2>
                        {timeline.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={timeline} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" />
                                    <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        formatter={(v) => [`${v} reports`, 'Reports']}
                                        contentStyle={{ background: '#1c1c2e', border: '1px solid #2a2a40', borderRadius: '8px', color: '#e2e8f0' }}
                                    />
                                    <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <p className="text-slate-500 text-center py-10">No timeline data</p>}
                    </section>
                </div>

                {/* Incident list */}
                <section className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/50">
                        <h2 className="text-white font-semibold">All Incidents</h2>
                    </div>
                    <div className="divide-y divide-border/30">
                        {reports.map((r, i) => (
                            <div key={r._id} className="px-6 py-4 hover:bg-white/2 transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl flex-shrink-0 mt-0.5">{MISUSE_ICONS[r.misuseType] || '📋'}</span>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-white font-medium capitalize">{r.misuseType}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.source === 'ussd' ? 'bg-blue-500/15 text-blue-400' : 'bg-green-500/15 text-green-400'}`}>
                                                    {r.source.toUpperCase()}
                                                </span>
                                            </div>
                                            {r.description && (
                                                <p className="text-sm text-slate-400 mt-1">{r.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                                <span>📍 {r.constituency ? `${r.constituency}, ` : ''}{r.county}</span>
                                                {r.lat && r.lng && (
                                                    <span className="text-slate-600">· {r.lat.toFixed(4)}, {r.lng.toFixed(4)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-600 flex-shrink-0">
                                        {new Date(r.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
