import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCandidates } from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState('all');

    useEffect(() => {
        getAllCandidates()
            .then((res) => setCandidates(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = candidates.filter((c) => {
        const matchesSearch = c.candidateName.toLowerCase().includes(search.toLowerCase());
        const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
        return matchesSearch && matchesRisk;
    });

    const MISUSE_ICONS = { vehicle: '🚗', building: '🏛️', funds: '💰', staff: '👥' };

    return (
        <div className="pt-20 min-h-screen">
            {/* Header */}
            <div className="relative border-b border-border/50 py-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 text-xs text-red-400 font-medium mb-3">
                        👤 Candidates
                    </div>
                    <h1 className="text-3xl font-bold text-white">Candidate Registry</h1>
                    <p className="text-slate-400 mt-1">All candidates with at least one reported misuse incident</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
                        <input
                            type="text"
                            placeholder="Search candidate name…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-9"
                        />
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        {['all', 'HIGH', 'MEDIUM', 'LOW'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRiskFilter(r)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${riskFilter === r
                                        ? 'bg-red-600 border-red-600 text-white'
                                        : 'border-border text-slate-400 hover:border-slate-400'
                                    }`}
                            >
                                {r === 'all' ? 'All Risk' : r}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-slate-400">Loading candidates…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-4xl mb-3">👤</p>
                        <p>No candidates found matching your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((c) => (
                            <Link
                                key={c.candidateName}
                                to={`/candidates/${encodeURIComponent(c.candidateName)}`}
                                className={`glass rounded-xl p-5 border hover:scale-[1.02] transition-transform duration-200 cursor-pointer ${c.riskLevel === 'HIGH'
                                        ? 'border-red-600/30 bg-gradient-to-br from-red-500/10 to-transparent'
                                        : c.riskLevel === 'MEDIUM'
                                            ? 'border-yellow-600/30 bg-gradient-to-br from-yellow-500/5 to-transparent'
                                            : 'border-border/50'
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                                        {c.candidateName.charAt(0)}
                                    </div>
                                    <RiskBadge level={c.riskLevel} />
                                </div>

                                <h3 className="text-white font-semibold text-sm mb-1 truncate">{c.candidateName}</h3>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                    <span>📋 {c.reportCount} reports</span>
                                    <span>📍 {c.counties?.length || 0} counties</span>
                                </div>

                                {/* Misuse types */}
                                <div className="flex flex-wrap gap-1">
                                    {(c.misuseTypes || []).map((t) => (
                                        <span
                                            key={t}
                                            className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border/50 text-slate-400"
                                        >
                                            {MISUSE_ICONS[t]} {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Last reported */}
                                {c.lastReported && (
                                    <p className="text-xs text-slate-600 mt-3">
                                        Last: {new Date(c.lastReported).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
