import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { METRO_COLORS, SPACING } from '../../constants/colors';
import { MOCK_SONGS, formatDuration } from '../../mocks/data';
import { usePlayerStore } from '../../stores/playerStore';

const GENRES = [
    { name: 'Pop', color: METRO_COLORS.cyan },
    { name: 'Rock', color: METRO_COLORS.orange },
    { name: 'Hip-Hop', color: METRO_COLORS.magenta },
    { name: 'Indie', color: METRO_COLORS.lime },
    { name: 'R&B', color: METRO_COLORS.purple },
    { name: 'Electronic', color: METRO_COLORS.blue },
];

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const { setQueue } = usePlayerStore();

    const filteredSongs = query
        ? MOCK_SONGS.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handlePlaySong = (index: number) => {
        setQueue(filteredSongs, index);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    SEARCH <Text style={styles.headerAccent}>MUSIC</Text>
                </Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search songs, artists..."
                    placeholderTextColor={METRO_COLORS.gray500}
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Results */}
                {query ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {filteredSongs.length} Results for "{query}"
                        </Text>
                        {filteredSongs.length > 0 ? (
                            filteredSongs.map((song, index) => (
                                <TouchableOpacity
                                    key={song.id}
                                    style={styles.songRow}
                                    onPress={() => handlePlaySong(index)}
                                    activeOpacity={0.7}
                                >
                                    <Image source={{ uri: song.coverUrl }} style={styles.songCover} />
                                    <View style={styles.songInfo}>
                                        <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                                        <Text style={styles.songArtist}>{song.artist}</Text>
                                    </View>
                                    <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noResults}>No songs found</Text>
                        )}
                    </View>
                ) : (
                    /* Browse by Genre */
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>BROWSE BY GENRE</Text>
                        <View style={styles.genreGrid}>
                            {GENRES.map((genre) => (
                                <TouchableOpacity
                                    key={genre.name}
                                    style={[styles.genreTile, { backgroundColor: genre.color }]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.genreText}>{genre.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
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
        color: METRO_COLORS.magenta,
    },
    searchContainer: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    searchInput: {
        backgroundColor: METRO_COLORS.gray800,
        borderLeftWidth: 4,
        borderLeftColor: METRO_COLORS.gray600,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: 16,
        color: METRO_COLORS.white,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: METRO_COLORS.magenta,
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
    },
    noResults: {
        color: METRO_COLORS.gray500,
        textAlign: 'center',
        paddingVertical: SPACING.xl,
    },
    genreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    genreTile: {
        width: '48%',
        aspectRatio: 1.5,
        justifyContent: 'flex-end',
        padding: SPACING.md,
    },
    genreText: {
        fontSize: 18,
        fontWeight: '700',
        color: METRO_COLORS.white,
        textTransform: 'uppercase',
    },
});
