import { MOCK_ANALYTICS } from '../../mocks/analytics';
import { TrendingUp, Music, Users, Activity } from 'lucide-react';

export const AnalyticsPanel = () => {
    const { playsPerDay, topSongs, genreDistribution, totalPlays, totalUsers, activeSessions } = MOCK_ANALYTICS;
    const maxPlays = Math.max(...playsPerDay.map(d => d.plays));

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
                                className={`${colors[i]} flex items-center justify-center transition-all hover:brightness-110`}
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
                                <div className={`w-3 h-3 ${colors[i]}`} />
                                <span className="text-xs text-gray-400">{g.genre} ({g.percentage}%)</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
