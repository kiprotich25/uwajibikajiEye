import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getAllReports } from '../services/api';

// Kenya center coordinates
const KENYA_CENTER = [-0.0236, 37.9062];
const KENYA_ZOOM = 6;

const MISUSE_ICONS = {
    vehicle: '🚗',
    building: '🏛️',
    funds: '💰',
    staff: '👥',
};

export default function MapView() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        getAllReports()
            .then((res) => setReports(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? reports : reports.filter((r) => r.misuseType === filter);
    const withCoords = filtered.filter((r) => r.lat && r.lng);

    return (
        <div className="pt-16 min-h-screen flex flex-col">
            {/* Header */}
            <div className="relative border-b border-border/50 py-8 overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 text-xs text-red-400 font-medium mb-2">
                            🗺️ Kenya Map
                        </div>
                        <h1 className="text-2xl font-bold text-white">Incident Map</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {withCoords.length} of {filtered.length} reports have GPS coordinates
                        </p>
                    </div>

                    {/* Filter */}
                    <div className="flex flex-wrap gap-2">
                        {['all', 'vehicle', 'building', 'funds', 'staff'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f
                                        ? 'bg-red-600 border-red-600 text-white'
                                        : 'bg-transparent border-border text-slate-400 hover:border-slate-400'
                                    }`}
                            >
                                {f === 'all' ? 'All Types' : `${MISUSE_ICONS[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                {loading ? (
                    <div className="h-[600px] flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-slate-400 text-sm">Loading map data…</p>
                        </div>
                    </div>
                ) : (
                    <MapContainer
                        center={KENYA_CENTER}
                        zoom={KENYA_ZOOM}
                        style={{ height: '600px', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {withCoords.map((report) => (
                            <CircleMarker
                                key={report._id}
                                center={[report.lat, report.lng]}
                                radius={8}
                                pathOptions={{
                                    color: '#ef4444',
                                    fillColor: '#ef4444',
                                    fillOpacity: 0.7,
                                    weight: 2,
                                }}
                            >
                                <Popup className="dark-popup">
                                    <div className="text-sm" style={{ minWidth: '200px' }}>
                                        <div className="font-bold text-red-600 mb-1">
                                            {MISUSE_ICONS[report.misuseType]} {report.candidateName}
                                        </div>
                                        <div className="space-y-1 text-gray-700">
                                            <div>
                                                <span className="font-medium">Type:</span>{' '}
                                                <span className="capitalize">{report.misuseType}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Location:</span>{' '}
                                                {report.constituency ? `${report.constituency}, ` : ''}{report.county}
                                            </div>
                                            {report.description && (
                                                <div>
                                                    <span className="font-medium">Details:</span>{' '}
                                                    <span className="text-gray-600">{report.description}</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium">Source:</span>{' '}
                                                <span className="uppercase text-xs font-bold">{report.source}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Date:</span>{' '}
                                                {new Date(report.createdAt).toLocaleDateString('en-KE', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                )}

                {/* Missing coords notice */}
                {!loading && filtered.length > withCoords.length && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] glass rounded-full px-4 py-2 text-xs text-slate-400 border border-border/50">
                        📍 {filtered.length - withCoords.length} report(s) have no GPS coordinates and are not shown on the map
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="border-t border-border/50 py-4 bg-surface/30 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6 text-sm text-slate-400">
                    <span className="font-medium text-white">Legend:</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                        Misuse Incident
                    </span>
                    <span className="text-slate-600">|</span>
                    <span>Click a marker for details</span>
                </div>
            </div>
        </div>
    );
}
