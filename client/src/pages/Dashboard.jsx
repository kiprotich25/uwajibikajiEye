import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getDashboardStats, getAllCandidates } from '../services/api';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import { Link } from 'react-router-dom';

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass rounded-lg p-3 border border-border/80 text-sm">
                <p className="text-white font-medium">{label}</p>
                <p className="text-red-400">{payload[0].value} reports</p>
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getDashboardStats()
            .then((res) => setStats(res.data.data))
            .catch((err) => setError(err.message || 'Failed to load dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading dashboard…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center text-red-400">
                <p className="text-xl mb-2">⚠️ {error}</p>
                <p className="text-sm text-slate-500">Make sure the backend server is running.</p>
            </div>
        </div>
    );

    const { totalReports, byCounty, byCandidate, byType, bySource, highRiskCandidates, recentReports } = stats;

    const pieData = byType.map((t, i) => ({
        name: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        value: t.count,
        color: COLORS[i % COLORS.length],
    }));

    return (
        <div className="pt-20 min-h-screen">
            {/* Header */}
            <div className="relative border-b border-border/50 py-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 text-xs text-red-400 font-medium mb-3">
                        📊 Live Analytics
                    </div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Real-time overview of reported misuse across Kenya</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Reports" value={totalReports} icon="📋" color="red" sublabel="All time" />
                    <StatCard label="Counties Affected" value={byCounty.length} icon="📍" color="yellow" sublabel="Unique counties" />
                    <StatCard label="Candidates Flagged" value={byCandidate.length} icon="👤" color="blue" sublabel="With at least 1 report" />
                    <StatCard label="High Risk" value={highRiskCandidates.length} icon="🚨" color="red" sublabel="6+ reports" />
                </div>

                {/* High risk candidates */}
                {highRiskCandidates.length > 0 && (
                    <section className="glass rounded-xl border border-red-600/30 bg-gradient-to-br from-red-500/10 to-transparent overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-600/20 flex items-center gap-2">
                            <span className="pulse-red w-2 h-2 rounded-full bg-red-500" />
                            <h2 className="text-white font-semibold">🚨 High Risk Candidates</h2>
                            <span className="ml-auto text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">6+ reports</span>
                        </div>
                        <div className="divide-y divide-border/30">
                            {highRiskCandidates.map((c) => (
                                <div key={c.candidateName} className="px-6 py-4 flex items-center justify-between hover:bg-red-500/5 transition">
                                    <div>
                                        <Link
                                            to={`/candidates/${encodeURIComponent(c.candidateName)}`}
                                            className="text-white font-medium hover:text-red-400 transition"
                                        >
                                            {c.candidateName}
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-red-300 font-bold">{c.count} reports</span>
                                        <RiskBadge level={c.riskLevel} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* By County */}
                    <section className="glass rounded-xl border border-border/50 p-6">
                        <h2 className="text-white font-semibold mb-5">Reports by County</h2>
                        {byCounty.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={byCounty.slice(0, 10)} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" />
                                    <XAxis dataKey="county" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239,68,68,0.05)' }} />
                                    <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[280px] flex items-center justify-center text-slate-500">No data yet</div>
                        )}
                    </section>

                    {/* By Type - Pie */}
                    <section className="glass rounded-xl border border-border/50 p-6">
                        <h2 className="text-white font-semibold mb-5">Reports by Misuse Type</h2>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={{ stroke: '#475569' }}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v) => [`${v} reports`, 'Count']} contentStyle={{ background: '#1c1c2e', border: '1px solid #2a2a40', borderRadius: '8px' }} />
                                    <Legend iconType="circle" wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[280px] flex items-center justify-center text-slate-500">No data yet</div>
                        )}
                    </section>
                </div>

                {/* By Candidate */}
                <section className="glass rounded-xl border border-border/50 p-6">
                    <h2 className="text-white font-semibold mb-5">Reports by Candidate</h2>
                    {byCandidate.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={byCandidate.slice(0, 10)} margin={{ top: 5, right: 5, bottom: 30, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" />
                                <XAxis dataKey="candidateName" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} angle={-25} textAnchor="end" />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239,68,68,0.05)' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {byCandidate.slice(0, 10).map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={entry.riskLevel === 'HIGH' ? '#ef4444' : entry.riskLevel === 'MEDIUM' ? '#f59e0b' : '#22c55e'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-slate-500">No data yet</div>
                    )}
                    <p className="text-xs text-slate-600 mt-2">Bar colors: 🔴 High Risk · 🟡 Medium · 🟢 Low</p>
                </section>

                {/* Recent reports */}
                <section className="glass rounded-xl border border-border/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/50">
                        <h2 className="text-white font-semibold">Recent Reports</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 text-xs border-b border-border/50">
                                    <th className="text-left px-6 py-3 font-medium">Candidate</th>
                                    <th className="text-left px-6 py-3 font-medium">Type</th>
                                    <th className="text-left px-6 py-3 font-medium">County</th>
                                    <th className="text-left px-6 py-3 font-medium">Source</th>
                                    <th className="text-left px-6 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {recentReports.map((r) => (
                                    <tr key={r._id} className="hover:bg-white/2 transition">
                                        <td className="px-6 py-3">
                                            <Link
                                                to={`/candidates/${encodeURIComponent(r.candidateName)}`}
                                                className="text-white hover:text-red-400 transition font-medium"
                                            >
                                                {r.candidateName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="capitalize text-slate-300">{r.misuseType}</span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-400">{r.county}</td>
                                        <td className="px-6 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.source === 'ussd' ? 'bg-blue-500/15 text-blue-400' : 'bg-green-500/15 text-green-400'}`}>
                                                {r.source.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">
                                            {new Date(r.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentReports.length === 0 && (
                            <div className="py-10 text-center text-slate-500">No reports yet. Be the first to report!</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
