const config = {
    HIGH: {
        label: 'HIGH RISK',
        bg: 'bg-red-500/15',
        border: 'border-red-500/40',
        text: 'text-red-400',
        dot: 'bg-red-500',
    },
    MEDIUM: {
        label: 'MEDIUM RISK',
        bg: 'bg-yellow-500/15',
        border: 'border-yellow-500/40',
        text: 'text-yellow-400',
        dot: 'bg-yellow-500',
    },
    LOW: {
        label: 'LOW RISK',
        bg: 'bg-green-500/15',
        border: 'border-green-500/40',
        text: 'text-green-400',
        dot: 'bg-green-500',
    },
    NONE: {
        label: 'NO RISK',
        bg: 'bg-slate-500/15',
        border: 'border-slate-500/40',
        text: 'text-slate-400',
        dot: 'bg-slate-500',
    },
};

export default function RiskBadge({ level = 'NONE', size = 'md' }) {
    const c = config[level] || config.NONE;
    const sizeClass = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-xs';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide ${c.bg} ${c.border} ${c.text} ${sizeClass} border`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full ${c.dot} ${level === 'HIGH' ? 'pulse-red' : ''}`}
            />
            {c.label}
        </span>
    );
}
