import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { METRO_COLORS, SPACING } from '../constants/colors';
import { usePlayerStore } from '../stores/playerStore';
import { formatDuration } from '../mocks/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PlayerScreen() {
    const router = useRouter();
    const {
        currentSong,
        isPlaying,
        progress,
        togglePlay,
        nextSong,
        previousSong,
        setProgress,
    } = usePlayerStore();

    if (!currentSong) {
        return (
            <View style={styles.container}>
                <Text style={styles.noSong}>No song playing</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentTime = Math.floor((progress / 100) * currentSong.duration);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="chevron-down" size={28} color={METRO_COLORS.white} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerLabel}>NOW PLAYING</Text>
                </View>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={METRO_COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Album Art */}
            <View style={styles.artContainer}>
                {currentSong.coverUrl ? (
                    <Image source={{ uri: currentSong.coverUrl }} style={styles.albumArt} />
                ) : (
                    <View style={[styles.albumArt, styles.albumArtPlaceholder]}>
                        <Ionicons name="musical-notes" size={80} color={METRO_COLORS.gray600} />
                    </View>
                )}
            </View>

            {/* Song Info */}
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
                <Text style={styles.songArtist}>{currentSong.artist}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatDuration(currentTime)}</Text>
                    <Text style={styles.timeText}>{formatDuration(currentSong.duration)}</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="shuffle" size={24} color={METRO_COLORS.gray500} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={previousSong}>
                    <Ionicons name="play-skip-back" size={32} color={METRO_COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={36}
                        color={METRO_COLORS.white}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={nextSong}>
                    <Ionicons name="play-skip-forward" size={32} color={METRO_COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="repeat" size={24} color={METRO_COLORS.gray500} />
                </TouchableOpacity>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.bottomButton}>
                    <Ionicons name="heart-outline" size={24} color={METRO_COLORS.gray400} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton}>
                    <Ionicons name="share-outline" size={24} color={METRO_COLORS.gray400} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton}>
                    <Ionicons name="list-outline" size={24} color={METRO_COLORS.gray400} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: METRO_COLORS.dark,
        paddingHorizontal: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: SPACING.md,
    },
    headerButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: METRO_COLORS.cyan,
        letterSpacing: 2,
    },
    artContainer: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    albumArt: {
        width: SCREEN_WIDTH - 80,
        height: SCREEN_WIDTH - 80,
    },
    albumArtPlaceholder: {
        backgroundColor: METRO_COLORS.gray800,
        justifyContent: 'center',
        alignItems: 'center',
    },
    songInfo: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: METRO_COLORS.white,
        textAlign: 'center',
    },
    songArtist: {
        fontSize: 14,
        color: METRO_COLORS.gray500,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: 4,
    },
    progressContainer: {
        marginBottom: SPACING.xl,
    },
    progressBar: {
        height: 4,
        backgroundColor: METRO_COLORS.gray700,
    },
    progressFill: {
        height: '100%',
        backgroundColor: METRO_COLORS.cyan,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
    },
    timeText: {
        fontSize: 11,
        color: METRO_COLORS.gray500,
        fontVariant: ['tabular-nums'],
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    controlButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SPACING.sm,
    },
    playButton: {
        width: 70,
        height: 70,
        backgroundColor: METRO_COLORS.cyan,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SPACING.md,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.xl,
    },
    bottomButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noSong: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: METRO_COLORS.gray500,
        fontSize: 18,
    },
    backText: {
        textAlign: 'center',
        color: METRO_COLORS.cyan,
        fontSize: 16,
        padding: SPACING.lg,
    },
});
