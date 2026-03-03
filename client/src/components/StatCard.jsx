export default function StatCard({ label, value, icon, color = 'red', sublabel }) {
    const colorMap = {
        red: 'from-red-500/20 to-red-900/10 border-red-600/30 text-red-400',
        yellow: 'from-yellow-500/20 to-yellow-900/10 border-yellow-600/30 text-yellow-400',
        green: 'from-green-500/20 to-green-900/10 border-green-600/30 text-green-400',
        blue: 'from-blue-500/20 to-blue-900/10 border-blue-600/30 text-blue-400',
        purple: 'from-purple-500/20 to-purple-900/10 border-purple-600/30 text-purple-400',
    };

    const cls = colorMap[color] || colorMap.red;

    return (
        <div className={`glass rounded-xl p-5 bg-gradient-to-br ${cls} border hover:scale-[1.02] transition-transform duration-200`}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">{label}</p>
                <div className="text-2xl">{icon}</div>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
        </div>
    );
}
