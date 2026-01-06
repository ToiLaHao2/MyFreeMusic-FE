// Mock User Activity Logs
export interface UserLog {
    id: string;
    userId: string;
    action: 'LOGIN' | 'LOGOUT' | 'PLAY_SONG' | 'CREATE_PLAYLIST' | 'LIKE_SONG' | 'SHARE_PLAYLIST';
    details: string;
    timestamp: string;
}

export const MOCK_USER_LOGS: UserLog[] = [
    { id: '1', userId: '1', action: 'LOGIN', details: 'Logged in from Chrome/Windows', timestamp: '2026-01-06T10:30:00' },
    { id: '2', userId: '1', action: 'PLAY_SONG', details: 'Played "Blinding Lights"', timestamp: '2026-01-06T10:32:00' },
    { id: '3', userId: '1', action: 'CREATE_PLAYLIST', details: 'Created playlist "Morning Vibes"', timestamp: '2026-01-06T10:45:00' },
    { id: '4', userId: '1', action: 'LIKE_SONG', details: 'Liked "Shape of You"', timestamp: '2026-01-06T11:00:00' },
    { id: '5', userId: '2', action: 'LOGIN', details: 'Logged in from Safari/MacOS', timestamp: '2026-01-06T09:00:00' },
    { id: '6', userId: '2', action: 'PLAY_SONG', details: 'Played "Havana"', timestamp: '2026-01-06T09:15:00' },
    { id: '7', userId: '2', action: 'SHARE_PLAYLIST', details: 'Shared "Party Mix" publicly', timestamp: '2026-01-06T09:30:00' },
    { id: '8', userId: '1', action: 'LOGOUT', details: 'Session ended', timestamp: '2026-01-06T12:00:00' },
];

// Mock Analytics Data
export const MOCK_ANALYTICS = {
    playsPerDay: [
        { day: 'Mon', plays: 124 },
        { day: 'Tue', plays: 189 },
        { day: 'Wed', plays: 156 },
        { day: 'Thu', plays: 203 },
        { day: 'Fri', plays: 287 },
        { day: 'Sat', plays: 342 },
        { day: 'Sun', plays: 298 },
    ],
    topSongs: [
        { title: 'Blinding Lights', artist: 'The Weeknd', plays: 1247 },
        { title: 'Shape of You', artist: 'Ed Sheeran', plays: 1089 },
        { title: 'Havana', artist: 'Camila Cabello', plays: 956 },
        { title: 'Levitating', artist: 'Dua Lipa', plays: 823 },
        { title: 'Peaches', artist: 'Justin Bieber', plays: 712 },
    ],
    genreDistribution: [
        { genre: 'Pop', percentage: 45 },
        { genre: 'Rock', percentage: 20 },
        { genre: 'Hip-Hop', percentage: 18 },
        { genre: 'Electronic', percentage: 12 },
        { genre: 'Other', percentage: 5 },
    ],
    totalPlays: 15420,
    totalUsers: 128,
    activeSessions: 24,
};

// Mock Likes Data
export interface Like {
    id: string;
    userId: string;
    targetId: string;
    targetType: 'song' | 'playlist';
    createdAt: string;
}

export const MOCK_LIKES: Like[] = [
    { id: '1', userId: '1', targetId: '1', targetType: 'song', createdAt: '2026-01-05' },
    { id: '2', userId: '1', targetId: '3', targetType: 'song', createdAt: '2026-01-05' },
    { id: '3', userId: '2', targetId: '1', targetType: 'playlist', createdAt: '2026-01-04' },
    { id: '4', userId: '2', targetId: '2', targetType: 'song', createdAt: '2026-01-04' },
];

// Helper to get likes count
export const getLikesCount = (targetId: string, targetType: 'song' | 'playlist'): number => {
    return MOCK_LIKES.filter(l => l.targetId === targetId && l.targetType === targetType).length;
};

// Helper to check if user liked
export const isLikedByUser = (userId: string, targetId: string, targetType: 'song' | 'playlist'): boolean => {
    return MOCK_LIKES.some(l => l.userId === userId && l.targetId === targetId && l.targetType === targetType);
};
