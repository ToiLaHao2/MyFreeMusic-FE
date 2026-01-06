import type { User } from '../store/slices/authSlice';

export const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'admin@myfreemusic.com',
        fullName: 'Admin User',
        role: 'ADMIN',
        profilePicture: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
    },
    {
        id: '2',
        email: 'user@myfreemusic.com',
        fullName: 'Normal User',
        role: 'USER',
        profilePicture: 'https://ui-avatars.com/api/?name=Normal+User&background=random',
    },
];
