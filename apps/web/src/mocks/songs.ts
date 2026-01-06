export interface Song {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    duration: number;
    url: string; // HLS url or mp3
}

export const MOCK_SONGS: Song[] = [
    {
        id: '1',
        title: 'Havana',
        artist: 'Camila Cabello',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/98/Havana_%28Camila_Cabello_song%29.png',
        duration: 216,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder
    },
    {
        id: '2',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29.png',
        duration: 233,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
        id: '3',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
        duration: 200,
        url: '',
    },
    {
        id: '4',
        title: 'Levitating',
        artist: 'Dua Lipa',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Levitating.png',
        duration: 203,
        url: '',
    },
    {
        id: '5',
        title: 'Peaches',
        artist: 'Justin Bieber',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Justin_Bieber_-_Peaches.png',
        duration: 198,
        url: '',
    },
];
