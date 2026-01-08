import { useState, useEffect } from 'react';
import { analyticsApi } from '../../lib/api-client';
import { TrendingUp, Music, Users, Activity, Loader2 } from 'lucide-react';

interface Analytics {
    totalPlays: number;
    totalUsers: number;
    activeSessions: number;
    playsPerDay: { day: string; plays: number }[];
    topSongs: { title: string; artist: string; plays: number }[];
    genreDistribution: { genre: string; percentage: number }[];
}

export const AnalyticsPanel = () => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await analyticsApi.getAnalytics();
            setAnalytics(res.data.data.analytics || null);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-metro-cyan" size={48} />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-20 text-gray-400">
                Failed to load analytics data
            </div>
        );
    }

    const { playsPerDay, topSongs, genreDistribution, totalPlays, totalUsers, activeSessions } = analytics;
    const maxPlays = Math.max(...playsPerDay.map(d => d.plays), 1);

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-metro-blue p-6">
                    <TrendingUp size={24} className="text-white/80 mb-2" />
                    <p className="text-3xl font-bold text-white">{totalPlays.toLocaleString()}</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Total Plays</p>
                </div>
                <div className="bg-metro-magenta p-6">
                    <Users size={24} className="text-white/80 mb-2" />
                    <p className="text-3xl font-bold text-white">{totalUsers}</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Total Users</p>
                </div>
                <div className="bg-metro-lime p-6">
                    <Activity size={24} className="text-white/80 mb-2" />
                    <p className="text-3xl font-bold text-white">{activeSessions}</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Active Now</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plays Per Day Chart */}
                <div className="bg-gray-900 border border-gray-800 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-metro-cyan mb-6">
                        Plays This Week
                    </h3>
                    <div className="flex items-end justify-between h-40 gap-2">
                        {playsPerDay.map(({ day, plays }) => (
                            <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-metro-cyan transition-all hover:bg-cyan-400"
                                    style={{ height: `${(plays / maxPlays) * 100}%` }}
                                />
                                <span className="text-xs text-gray-500">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Songs */}
                <div className="bg-gray-900 border border-gray-800 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-metro-magenta mb-6">
                        Top 5 Songs
                    </h3>
                    <div className="space-y-3">
                        {topSongs.map((song, i) => (
                            <div key={song.title} className="flex items-center gap-4">
                                <span className="w-6 h-6 flex items-center justify-center bg-metro-magenta text-white text-xs font-bold">
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm truncate">{song.title}</p>
                                    <p className="text-xs text-gray-500">{song.artist}</p>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Music size={12} />
                                    <span className="text-xs font-mono">{song.plays.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Genre Distribution */}
            <div className="bg-gray-900 border border-gray-800 p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-metro-orange mb-6">
                    Genre Distribution
                </h3>
                <div className="flex h-8 overflow-hidden">
                    {genreDistribution.map((g, i) => {
                        const colors = ['bg-metro-cyan', 'bg-metro-magenta', 'bg-metro-lime', 'bg-metro-orange', 'bg-gray-600'];
                        return (
                            <div
                                key={g.genre}
                                className={`${colors[i % colors.length]} flex items-center justify-center transition-all hover:brightness-110`}
                                style={{ width: `${g.percentage}%` }}
                                title={`${g.genre}: ${g.percentage}%`}
                            >
                                {g.percentage >= 15 && (
                                    <span className="text-xs font-bold text-white">{g.genre}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                    {genreDistribution.map((g, i) => {
                        const colors = ['bg-metro-cyan', 'bg-metro-magenta', 'bg-metro-lime', 'bg-metro-orange', 'bg-gray-600'];
                        return (
                            <div key={g.genre} className="flex items-center gap-2">
                                <div className={`w-3 h-3 ${colors[i % colors.length]}`} />
                                <span className="text-xs text-gray-400">{g.genre} ({g.percentage}%)</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

