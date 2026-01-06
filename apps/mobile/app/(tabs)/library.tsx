import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { METRO_COLORS, SPACING } from '../../constants/colors';
import { MOCK_PLAYLISTS, MOCK_SONGS } from '../../mocks/data';
import type { Song } from '../../stores/playerStore';
import { usePlayerStore } from '../../stores/playerStore';

type TabType = 'server' | 'local' | 'all';

export default function LibraryScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [localSongs, setLocalSongs] = useState<Song[]>([]);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const { setQueue } = usePlayerStore();

    // Request permission and load local songs
    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setHasPermission(status === 'granted');

            if (status === 'granted') {
                try {
                    const media = await MediaLibrary.getAssetsAsync({
                        mediaType: 'audio',
                        first: 100,
                    });

                    const songs: Song[] = media.assets.map((asset, index) => ({
                        id: `local-${asset.id}`,
                        title: asset.filename.replace(/\.[^/.]+$/, ''),
                        artist: 'Local Artist',
                        duration: Math.floor(asset.duration),
                        localUri: asset.uri,
                        source: 'local' as const,
                    }));

                    setLocalSongs(songs);
                } catch (error) {
                    console.log('Error loading local music:', error);
                }
            }
        })();
    }, []);

    // Combine songs based on tab
    const displaySongs = (): Song[] => {
        switch (activeTab) {
            case 'server':
                return MOCK_SONGS;
            case 'local':
                return localSongs;
            case 'all':
                return [...MOCK_SONGS, ...localSongs];
        }
    };

    const handlePlaySong = (index: number) => {
        setQueue(displaySongs(), index);
    };

    const Tab = ({ tab, label }: { tab: TabType; label: string }) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    MY <Text style={styles.headerAccent}>LIBRARY</Text>
                </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <Tab tab="all" label="ALL" />
                <Tab tab="server" label="SERVER ☁️" />
                <Tab tab="local" label="LOCAL 📱" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Playlists Section (only for server/all) */}
                {(activeTab === 'server' || activeTab === 'all') && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PLAYLISTS</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {MOCK_PLAYLISTS.map((playlist) => (
                                <TouchableOpacity key={playlist.id} style={styles.playlistCard}>
                                    <Image
                                        source={{ uri: playlist.coverUrl }}
                                        style={styles.playlistCover}
                                    />
                                    <Text style={styles.playlistName} numberOfLines={1}>
                                        {playlist.name}
                                    </Text>
                                    <Text style={styles.playlistCount}>
                                        {playlist.songIds.length} songs
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Songs Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {activeTab === 'local' ? 'LOCAL SONGS' : 'ALL SONGS'} ({displaySongs().length})
                    </Text>

                    {activeTab === 'local' && !hasPermission && (
                        <View style={styles.permissionBox}>
                            <Text style={styles.permissionText}>
                                Permission needed to access local music
                            </Text>
                            <TouchableOpacity
                                style={styles.permissionButton}
                                onPress={() => MediaLibrary.requestPermissionsAsync()}
                            >
                                <Text style={styles.permissionButtonText}>GRANT ACCESS</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {displaySongs().map((song, index) => (
                        <TouchableOpacity
                            key={song.id}
                            style={styles.songRow}
                            onPress={() => handlePlaySong(index)}
                        >
                            <View style={[
                                styles.sourceIndicator,
                                { backgroundColor: song.source === 'server' ? METRO_COLORS.cyan : METRO_COLORS.orange }
                            ]} />
                            {song.coverUrl ? (
                                <Image source={{ uri: song.coverUrl }} style={styles.songCover} />
                            ) : (
                                <View style={[styles.songCover, styles.songCoverPlaceholder]}>
                                    <Text style={styles.songCoverText}>🎵</Text>
                                </View>
                            )}
                            <View style={styles.songInfo}>
                                <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                                <Text style={styles.songArtist}>{song.artist}</Text>
                            </View>
                            <Text style={styles.sourceLabel}>
                                {song.source === 'server' ? '☁️' : '📱'}
                            </Text>
                        </TouchableOpacity>
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
        paddingBottom: SPACING.md,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '200',
        color: METRO_COLORS.white,
        letterSpacing: 2,
    },
    headerAccent: {
        fontWeight: '700',
        color: METRO_COLORS.cyan,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: METRO_COLORS.gray800,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: METRO_COLORS.cyan,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '700',
        color: METRO_COLORS.gray500,
        letterSpacing: 1,
    },
    tabTextActive: {
        color: METRO_COLORS.white,
    },
    section: {
        paddingVertical: SPACING.lg,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: METRO_COLORS.gray500,
        letterSpacing: 2,
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    playlistCard: {
        width: 140,
        marginLeft: SPACING.lg,
    },
    playlistCover: {
        width: 140,
        height: 140,
        marginBottom: SPACING.sm,
    },
    playlistName: {
        fontSize: 14,
        fontWeight: '600',
        color: METRO_COLORS.white,
    },
    playlistCount: {
        fontSize: 12,
        color: METRO_COLORS.gray500,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: METRO_COLORS.gray800,
    },
    sourceIndicator: {
        width: 4,
        height: 40,
        marginRight: SPACING.sm,
    },
    songCover: {
        width: 48,
        height: 48,
        marginRight: SPACING.md,
    },
    songCoverPlaceholder: {
        backgroundColor: METRO_COLORS.gray700,
        justifyContent: 'center',
        alignItems: 'center',
    },
    songCoverText: {
        fontSize: 20,
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
    sourceLabel: {
        fontSize: 16,
    },
    permissionBox: {
        margin: SPACING.lg,
        padding: SPACING.lg,
        backgroundColor: METRO_COLORS.gray800,
        alignItems: 'center',
    },
    permissionText: {
        color: METRO_COLORS.gray400,
        marginBottom: SPACING.md,
    },
    permissionButton: {
        backgroundColor: METRO_COLORS.orange,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
    },
    permissionButtonText: {
        color: METRO_COLORS.white,
        fontWeight: '700',
        letterSpacing: 1,
    },
});
