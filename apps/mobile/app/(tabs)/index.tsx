import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { METRO_COLORS, SPACING } from '../../constants/colors';
import { MOCK_SONGS, MOCK_PLAYLISTS, formatDuration } from '../../mocks/data';
import { usePlayerStore } from '../../stores/playerStore';
import { useAuthStore } from '../../stores/authStore';

// Metro Tile Component
const MetroTile = ({
    title,
    count,
    color,
    onPress,
    size = 'normal',
}: {
    title: string;
    count?: string | number;
    color: string;
    onPress: () => void;
    size?: 'normal' | 'wide';
}) => (
    <TouchableOpacity
        style={[
            styles.tile,
            { backgroundColor: color },
            size === 'wide' && styles.tileWide,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Text style={styles.tileCount}>{count}</Text>
        <Text style={styles.tileTitle}>{title}</Text>
    </TouchableOpacity>
);

// Song Row Component
const SongRow = ({ song, index, onPress }: { song: any; index: number; onPress: () => void }) => (
    <TouchableOpacity style={styles.songRow} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.songIndex}>{index + 1}</Text>
        <Image source={{ uri: song.coverUrl }} style={styles.songCover} />
        <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.songArtist}>{song.artist}</Text>
        </View>
        <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>
    </TouchableOpacity>
);

export default function HomeScreen() {
    const router = useRouter();
    const { playSong, setQueue } = usePlayerStore();
    const { user } = useAuthStore();

    const handlePlaySong = (song: any, index: number) => {
        setQueue(MOCK_SONGS, index);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        MY<Text style={styles.headerAccent}>FREE</Text>MUSIC
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        Welcome back{user ? `, ${user.fullName.split(' ')[0]}` : ''}
                    </Text>
                </View>

                {/* Metro Tiles Grid */}
                <View style={styles.tilesContainer}>
                    <MetroTile
                        title="LIBRARY"
                        count={MOCK_PLAYLISTS.length}
                        color={METRO_COLORS.cyan}
                        onPress={() => router.push('/library')}
                        size="wide"
                    />
                    <MetroTile
                        title="SEARCH"
                        color={METRO_COLORS.magenta}
                        onPress={() => router.push('/search')}
                    />
                    <MetroTile
                        title="PROFILE"
                        color={METRO_COLORS.lime}
                        onPress={() => router.push('/profile')}
                    />
                    <MetroTile
                        title="LOCAL"
                        count="📱"
                        color={METRO_COLORS.orange}
                        onPress={() => router.push('/library?tab=local')}
                    />
                    <MetroTile
                        title="SERVER"
                        count="☁️"
                        color={METRO_COLORS.blue}
                        onPress={() => router.push('/library?tab=server')}
                    />
                </View>

                {/* Recommended Songs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
                    {MOCK_SONGS.map((song, index) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={index}
                            onPress={() => handlePlaySong(song, index)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: METRO_COLORS.dark,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: METRO_COLORS.gray800,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '200',
        color: METRO_COLORS.white,
        letterSpacing: 4,
    },
    headerAccent: {
        fontWeight: '700',
        color: METRO_COLORS.cyan,
    },
    headerSubtitle: {
        fontSize: 14,
        color: METRO_COLORS.gray500,
        marginTop: 4,
    },
    tilesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.md,
        gap: SPACING.sm,
    },
    tile: {
        width: '48%',
        height: 100,
        padding: SPACING.md,
        justifyContent: 'space-between',
    },
    tileWide: {
        width: '100%',
    },
    tileCount: {
        fontSize: 24,
        fontWeight: '200',
        color: METRO_COLORS.white,
    },
    tileTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: METRO_COLORS.white,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: METRO_COLORS.gray500,
        letterSpacing: 2,
        marginBottom: SPACING.md,
        textTransform: 'uppercase',
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: METRO_COLORS.gray800,
    },
    songIndex: {
        width: 30,
        fontSize: 14,
        color: METRO_COLORS.gray500,
        textAlign: 'center',
    },
    songCover: {
        width: 48,
        height: 48,
        marginRight: SPACING.md,
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: METRO_COLORS.white,
    },
    songArtist: {
        fontSize: 12,
        color: METRO_COLORS.gray500,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    songDuration: {
        fontSize: 12,
        color: METRO_COLORS.gray500,
        fontVariant: ['tabular-nums'],
    },
});
