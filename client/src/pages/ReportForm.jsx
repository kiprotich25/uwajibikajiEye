import { useState } from 'react';
import { submitReport } from '../services/api';

const KENYA_COUNTIES = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu',
    'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru',
    'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const MISUSE_TYPES = [
    { value: 'vehicle', label: '🚗 Government Vehicles', desc: 'Cars, trucks, ambulances, etc.' },
    { value: 'building', label: '🏛️ Public Buildings', desc: 'Offices, halls, schools, etc.' },
    { value: 'funds', label: '💰 Public Funds', desc: 'Bursaries, CDF, ward budgets, etc.' },
    { value: 'staff', label: '👥 Civil Servants', desc: 'Government workers deployed for campaigns' },
];

const initialForm = {
    candidateName: '',
    misuseType: '',
    description: '',
    county: '',
    constituency: '',
    lat: '',
    lng: '',
};

export default function ReportForm() {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [getLocation, setGetLocation] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGeolocate = () => {
        setGetLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm({ ...form, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) });
                setGetLocation(false);
            },
            () => setGetLocation(false)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            await submitReport({
                ...form,
                lat: form.lat ? parseFloat(form.lat) : null,
                lng: form.lng ? parseFloat(form.lng) : null,
                source: 'web',
            });
            setStatus('success');
            setForm(initialForm);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Failed to submit report. Please try again.');
        }
    };

    return (
        <div className="pt-20 min-h-screen">
            {/* Header */}
            <div className="relative border-b border-border/50 py-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
                <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 text-xs text-red-400 font-medium mb-3">
                        📋 Web Reporting
                    </div>
                    <h1 className="text-3xl font-bold text-white">Submit a Misuse Report</h1>
                    <p className="text-slate-400 mt-2">
                        Report misuse of public resources in political campaigns. All fields marked * are required.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                {/* Success message */}
                {status === 'success' && (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-start gap-3 fade-in-up">
                        <span className="text-xl">✅</span>
                        <div>
                            <p className="font-semibold">Report submitted successfully!</p>
                            <p className="text-sm text-green-500/80 mt-0.5">Thank you for holding leaders accountable. Your report has been saved.</p>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {status === 'error' && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3">
                        <span className="text-xl">⚠️</span>
                        <p>{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Candidate Name */}
                    <div className="glass rounded-xl p-6 border border-border/50">
                        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 text-xs flex items-center justify-center">1</span>
                            Candidate Information
                        </h2>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">
                                Candidate Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="candidateName"
                                value={form.candidateName}
                                onChange={handleChange}
                                required
                                placeholder="e.g. John Kamau Mwangi"
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Misuse Type */}
                    <div className="glass rounded-xl p-6 border border-border/50">
                        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 text-xs flex items-center justify-center">2</span>
                            Type of Misuse <span className="text-red-500">*</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MISUSE_TYPES.map((t) => (
                                <label
                                    key={t.value}
                                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${form.misuseType === t.value
                                            ? 'bg-red-600/15 border-red-500/50 text-white'
                                            : 'bg-dark-800/50 border-border/50 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="misuseType"
                                        value={t.value}
                                        checked={form.misuseType === t.value}
                                        onChange={handleChange}
                                        className="mt-1 accent-red-500"
                                        required
                                    />
                                    <div>
                                        <div className="text-sm font-medium">{t.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="glass rounded-xl p-6 border border-border/50">
                        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 text-xs flex items-center justify-center">3</span>
                            Description
                        </h2>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the misuse incident in detail — what happened, when, and how..."
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Location */}
                    <div className="glass rounded-xl p-6 border border-border/50">
                        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 text-xs flex items-center justify-center">4</span>
                            Location
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">
                                    County <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="county"
                                        value={form.county}
                                        onChange={handleChange}
                                        required
                                        className="select-field"
                                    >
                                        <option value="">Select county…</option>
                                        {KENYA_COUNTIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">Constituency (optional)</label>
                                <input
                                    name="constituency"
                                    value={form.constituency}
                                    onChange={handleChange}
                                    placeholder="e.g. Starehe"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* GPS coordinates */}
                        <div className="mt-4">
                            <label className="block text-sm text-slate-400 mb-2">GPS Location (optional)</label>
                            <div className="flex gap-3">
                                <input
                                    name="lat"
                                    value={form.lat}
                                    onChange={handleChange}
                                    placeholder="Latitude"
                                    type="number"
                                    step="any"
                                    className="input-field"
                                />
                                <input
                                    name="lng"
                                    value={form.lng}
                                    onChange={handleChange}
                                    placeholder="Longitude"
                                    type="number"
                                    step="any"
                                    className="input-field"
                                />
                                <button
                                    type="button"
                                    onClick={handleGeolocate}
                                    disabled={getLocation}
                                    className="btn-secondary text-sm whitespace-nowrap px-3"
                                    title="Use my current location"
                                >
                                    {getLocation ? '⌛' : '📍'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Submitting Report…
                            </span>
                        ) : (
                            '→ Submit Report'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
