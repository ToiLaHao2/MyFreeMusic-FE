import { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { METRO_COLORS, SPACING } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock social feed data
const MOCK_POSTS = [
    {
        id: '1',
        user: { name: 'Alice Cooper', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        type: 'playlist',
        playlist: { name: 'Summer Vibes 2024', songs: 45, cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400' },
        likes: 128,
        comments: 24,
        timeAgo: '2h ago',
    },
    {
        id: '2',
        user: { name: 'Bob Marley', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        type: 'nowPlaying',
        song: { title: 'Blinding Lights', artist: 'The Weeknd', cover: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png' },
        likes: 89,
        comments: 12,
        timeAgo: '5h ago',
    },
    {
        id: '3',
        user: { name: 'Charlie XCX', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
        type: 'playlist',
        playlist: { name: 'Workout Mix', songs: 32, cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
        likes: 256,
        comments: 45,
        timeAgo: '1d ago',
    },
    {
        id: '4',
        user: { name: 'Dave Grohl', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        type: 'nowPlaying',
        song: { title: 'Shape of You', artist: 'Ed Sheeran', cover: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png' },
        likes: 67,
        comments: 8,
        timeAgo: '2d ago',
    },
];

// Story-like circles at top
const StoryCircle = ({ user, isAdd }: { user?: any; isAdd?: boolean }) => (
    <TouchableOpacity style={styles.storyContainer}>
        <View style={[styles.storyCircle, isAdd && styles.storyCircleAdd]}>
            {isAdd ? (
                <Ionicons name="add" size={28} color={METRO_COLORS.cyan} />
            ) : (
                <Image source={{ uri: user?.avatar }} style={styles.storyImage} />
            )}
        </View>
        <Text style={styles.storyName} numberOfLines={1}>
            {isAdd ? 'Share' : user?.name?.split(' ')[0]}
        </Text>
    </TouchableOpacity>
);

// Post Card Component
const PostCard = ({ post }: { post: any }) => {
    const [liked, setLiked] = useState(false);

    return (
        <View style={styles.postCard}>
            {/* Header */}
            <View style={styles.postHeader}>
                <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
                <View style={styles.postHeaderInfo}>
                    <Text style={styles.postUserName}>{post.user.name}</Text>
                    <Text style={styles.postTime}>{post.timeAgo}</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color={METRO_COLORS.gray500} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {post.type === 'playlist' ? (
                <TouchableOpacity style={styles.playlistCard}>
                    <Image source={{ uri: post.playlist.cover }} style={styles.playlistCover} />
                    <View style={styles.playlistOverlay}>
                        <Text style={styles.playlistName}>{post.playlist.name}</Text>
                        <Text style={styles.playlistSongs}>{post.playlist.songs} songs</Text>
                    </View>
                    <View style={styles.playButton}>
                        <Ionicons name="play" size={24} color={METRO_COLORS.white} />
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.nowPlayingCard}>
                    <Image source={{ uri: post.song.cover }} style={styles.songCover} />
                    <View style={styles.songInfo}>
                        <Text style={styles.songTitle}>{post.song.title}</Text>
                        <Text style={styles.songArtist}>{post.song.artist}</Text>
                    </View>
                    <View style={styles.playButtonSmall}>
                        <Ionicons name="play" size={20} color={METRO_COLORS.white} />
                    </View>
                </TouchableOpacity>
            )}

            {/* Actions */}
            <View style={styles.postActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setLiked(!liked)}
                >
                    <Ionicons
                        name={liked ? "heart" : "heart-outline"}
                        size={22}
                        color={liked ? METRO_COLORS.magenta : METRO_COLORS.gray400}
                    />
                    <Text style={styles.actionText}>{post.likes + (liked ? 1 : 0)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={20} color={METRO_COLORS.gray400} />
                    <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={22} color={METRO_COLORS.gray400} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function CommunityScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'trending'>('feed');

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const tabs = [
        { key: 'feed', label: 'FEED' },
        { key: 'discover', label: 'DISCOVER' },
        { key: 'trending', label: 'TRENDING' },
    ] as const;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    COMM<Text style={styles.headerAccent}>UNITY</Text>
                </Text>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color={METRO_COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Feed */}
            <FlatList
                data={MOCK_POSTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={METRO_COLORS.cyan}
                    />
                }
                ListHeaderComponent={() => (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.storiesContainer}
                    >
                        <StoryCircle isAdd />
                        {MOCK_POSTS.map((post) => (
                            <StoryCircle key={post.id} user={post.user} />
                        ))}
                    </ScrollView>
                )}
                contentContainerStyle={styles.feedContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: METRO_COLORS.dark,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '200',
        color: METRO_COLORS.white,
        letterSpacing: 2,
    },
    headerAccent: {
        fontWeight: '700',
        color: METRO_COLORS.cyan,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    tab: {
        marginRight: SPACING.lg,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: METRO_COLORS.cyan,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: METRO_COLORS.gray500,
        letterSpacing: 1,
    },
    tabTextActive: {
        color: METRO_COLORS.white,
    },
    storiesContainer: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: METRO_COLORS.gray800,
    },
    storyContainer: {
        alignItems: 'center',
        marginLeft: SPACING.md,
        width: 70,
    },
    storyCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: METRO_COLORS.cyan,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    storyCircleAdd: {
        borderStyle: 'dashed',
        backgroundColor: METRO_COLORS.gray800,
    },
    storyImage: {
        width: '100%',
        height: '100%',
    },
    storyName: {
        fontSize: 10,
        color: METRO_COLORS.gray400,
        marginTop: 4,
    },
    feedContent: {
        paddingBottom: 100,
    },
    postCard: {
        marginHorizontal: SPACING.md,
        marginTop: SPACING.md,
        backgroundColor: METRO_COLORS.gray800,
        borderLeftWidth: 3,
        borderLeftColor: METRO_COLORS.cyan,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    postAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    postHeaderInfo: {
        flex: 1,
        marginLeft: SPACING.sm,
    },
    postUserName: {
        fontSize: 14,
        fontWeight: '600',
        color: METRO_COLORS.white,
    },
    postTime: {
        fontSize: 11,
        color: METRO_COLORS.gray500,
    },
    playlistCard: {
        height: 180,
        position: 'relative',
    },
    playlistCover: {
        width: '100%',
        height: '100%',
    },
    playlistOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.md,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    playlistName: {
        fontSize: 16,
        fontWeight: '700',
        color: METRO_COLORS.white,
    },
    playlistSongs: {
        fontSize: 12,
        color: METRO_COLORS.gray400,
    },
    playButton: {
        position: 'absolute',
        right: SPACING.md,
        bottom: SPACING.md + 40,
        width: 50,
        height: 50,
        backgroundColor: METRO_COLORS.cyan,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nowPlayingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: METRO_COLORS.gray700,
    },
    songCover: {
        width: 60,
        height: 60,
    },
    songInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    songTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: METRO_COLORS.white,
    },
    songArtist: {
        fontSize: 12,
        color: METRO_COLORS.gray500,
    },
    playButtonSmall: {
        width: 40,
        height: 40,
        backgroundColor: METRO_COLORS.magenta,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postActions: {
        flexDirection: 'row',
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: METRO_COLORS.gray700,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.lg,
    },
    actionText: {
        fontSize: 12,
        color: METRO_COLORS.gray400,
        marginLeft: 4,
    },
});
