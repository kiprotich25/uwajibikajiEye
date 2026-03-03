import { Link } from 'react-router-dom';

const features = [
    {
        icon: '📋',
        title: 'Web Reports',
        desc: 'Submit misuse reports via our detailed online form with location pinning.',
        color: 'from-red-500/20 to-transparent border-red-600/20',
    },
    // {
    //     icon: '📱',
    //     title: 'USSD Integration',
    //     desc: 'Report via any phone using Africa\'s Talking USSD — no internet needed.',
    //     color: 'from-orange-500/20 to-transparent border-orange-600/20',
    // },
    {
        icon: '📊',
        title: 'Live Dashboard',
        desc: 'Real-time analytics: reports by county, candidate, and misuse type.',
        color: 'from-yellow-500/20 to-transparent border-yellow-600/20',
    },
    {
        icon: '🗺️',
        title: 'Kenya Map',
        desc: 'Visualize reports geographically with interactive markers across counties.',
        color: 'from-green-500/20 to-transparent border-green-600/20',
    },
    {
        icon: '🎯',
        title: 'Risk Scoring',
        desc: 'Automated LOW / MEDIUM / HIGH risk assessment per candidate.',
        color: 'from-blue-500/20 to-transparent border-blue-600/20',
    },
    {
        icon: '👤',
        title: 'Candidate Profiles',
        desc: 'Full incident timeline and breakdown of each flagged candidate.',
        color: 'from-purple-500/20 to-transparent border-purple-600/20',
    },
];

const misuseTypes = [
    { label: 'Government Vehicles', icon: '🚗' },
    { label: 'Public Buildings', icon: '🏛️' },
    { label: 'Public Funds', icon: '💰' },
    { label: 'Civil Servants', icon: '👥' },
];

export default function Home() {
    return (
        <div className="pt-16">
            {/* Hero */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-3xl" />
                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-6 text-sm text-red-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-500 pulse-red" />
                            Civic Transparency Platform · Kenya 2027
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                            <span className="text-white">Holding Leaders</span>
                            <br />
                            <span className="gradient-text">Accountable</span>
                        </h1>

                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Track and report misuse of public resources in political campaigns.
                            From government vehicles to public funds — every abuse gets documented.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/report" className="btn-primary text-base">
                                Report Misuse Now
                            </Link>
                            <Link to="/dashboard" className="btn-secondary text-base">
                                View Dashboard →
                            </Link>
                        </div>

                        {/* Misuse types strip */}
                        <div className="flex flex-wrap justify-center gap-3 mt-12">
                            {misuseTypes.map((t) => (
                                <div
                                    key={t.label}
                                    className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-border/50 text-sm text-slate-400"
                                >
                                    <span>{t.icon}</span>
                                    {t.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats strip */}
            <section className="border-y border-border/50 bg-surface/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '47', label: 'Counties Covered', icon: '📍' },
                            { value: '4', label: 'Misuse Categories', icon: '🏷️' },
                            { value: '24/7', label: 'USSD Availability', icon: '📱' },
                            { value: 'Real-time', label: 'Analytics', icon: '📊' },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="text-2xl mb-1">{s.icon}</div>
                                <div className="text-3xl font-bold text-white">{s.value}</div>
                                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-3">Platform Features</h2>
                    <p className="text-slate-400">Everything you need to track and expose public resource misuse</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className={`glass rounded-xl p-6 border bg-gradient-to-br ${f.color} hover:scale-[1.02] transition-transform duration-200 cursor-default`}
                        >
                            <div className="text-3xl mb-4">{f.icon}</div>
                            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* USSD section
            <section className="border-y border-border/50 bg-surface/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Report via USSD</h2>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            No internet? No problem. Dial our USSD service from any mobile phone to report misuse
                            or check platform statistics — available 24/7 across Kenya.
                        </p>
                        <div className="glass rounded-xl p-5 border border-border/50 font-mono text-sm">
                            <div className="text-green-400 mb-1">► Dial: *XXX#</div>
                            <div className="text-slate-400 mt-3">1. Report Misuse</div>
                            <div className="text-slate-400">2. View Summary</div>
                            <div className="text-slate-400">3. Exit</div>
                        </div>
                    </div>
                    <div className="glass rounded-xl p-6 border border-red-600/20 bg-gradient-to-br from-red-500/5 to-transparent">
                        <h3 className="font-semibold text-white mb-4">How USSD Reporting Works</h3>
                        <ol className="space-y-3 text-sm text-slate-400">
                            {[
                                'Dial the USSD code on any phone',
                                'Select "1. Report Misuse" from the menu',
                                'Enter the candidate name',
                                'Choose the misuse type (vehicle / funds / staff / building)',
                                'Enter the county where it occurred',
                                'Report saved — thank you!',
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section> */}

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Make Leaders Accountable?</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Join thousands of Kenyans in making elections transparent and fair. Every report counts in the fight against corruption and misuse of public resources.
                </p>
                <Link to="/report" className="btn-primary text-lg px-8 py-4">
                    Submit a Report
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 text-center py-8 text-slate-600 text-sm">
                <p>© 2026 Uwajibikaji-Eye · Built for civic transparency in Kenya</p>
            </footer>
        </div>
    );
}
