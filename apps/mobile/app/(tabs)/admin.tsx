import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { METRO_COLORS, SPACING } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';

// Mock stats
const STATS = {
    totalUsers: 128,
    totalSongs: 5678,
    activeSessions: 24,
    pendingApprovals: 3,
};

// Mock users for admin
const MOCK_ADMIN_USERS = [
    { id: '1', name: 'Alice Cooper', email: 'alice@email.com', role: 'USER', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: '2', name: 'Bob Marley', email: 'bob@email.com', role: 'USER', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: '3', name: 'Charlie XCX', email: 'charlie@email.com', role: 'ADMIN', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: '4', name: 'Dave Grohl', email: 'dave@email.com', role: 'USER', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

// Stat Tile Component
const StatTile = ({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: any }) => (
    <View style={[styles.statTile, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={METRO_COLORS.white} style={styles.statIcon} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </View>
);

// User Row Component
const UserRow = ({ user, onDelete }: { user: any; onDelete: () => void }) => (
    <View style={styles.userRow}>
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={[styles.roleBadge, user.role === 'ADMIN' && styles.roleBadgeAdmin]}>
            <Text style={styles.roleText}>{user.role}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color={METRO_COLORS.magenta} />
        </TouchableOpacity>
    </View>
);

export default function AdminScreen() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics'>('overview');
    const [users, setUsers] = useState(MOCK_ADMIN_USERS);

    // Check if user is admin
    if (user?.role !== 'ADMIN') {
        return (
            <View style={styles.container}>
                <View style={styles.accessDenied}>
                    <Ionicons name="lock-closed" size={64} color={METRO_COLORS.magenta} />
                    <Text style={styles.accessDeniedText}>ACCESS DENIED</Text>
                    <Text style={styles.accessDeniedSubtext}>Admin privileges required</Text>
                </View>
            </View>
        );
    }

    const handleDeleteUser = (userId: string) => {
        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setUsers(users.filter(u => u.id !== userId))
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    ADMIN <Text style={styles.headerAccent}>PANEL</Text>
                </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {(['overview', 'users', 'analytics'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Grid */}
                        <View style={styles.statsGrid}>
                            <StatTile
                                title="USERS"
                                value={STATS.totalUsers}
                                color={METRO_COLORS.blue}
                                icon="people"
                            />
                            <StatTile
                                title="SONGS"
                                value={STATS.totalSongs}
                                color={METRO_COLORS.magenta}
                                icon="musical-notes"
                            />
                            <StatTile
                                title="ACTIVE"
                                value={STATS.activeSessions}
                                color={METRO_COLORS.lime}
                                icon="pulse"
                            />
                            <StatTile
                                title="PENDING"
                                value={STATS.pendingApprovals}
                                color={METRO_COLORS.orange}
                                icon="hourglass"
                            />
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
                            <TouchableOpacity style={styles.actionTile}>
                                <Ionicons name="person-add" size={24} color={METRO_COLORS.cyan} />
                                <Text style={styles.actionTileText}>Add New User</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionTile}>
                                <Ionicons name="cloud-upload" size={24} color={METRO_COLORS.lime} />
                                <Text style={styles.actionTileText}>Bulk Upload Songs</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionTile}>
                                <Ionicons name="analytics" size={24} color={METRO_COLORS.magenta} />
                                <Text style={styles.actionTileText}>View Analytics</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {activeTab === 'users' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>USER MANAGEMENT</Text>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={20} color={METRO_COLORS.white} />
                            </TouchableOpacity>
                        </View>
                        {users.map((u) => (
                            <UserRow
                                key={u.id}
                                user={u}
                                onDelete={() => handleDeleteUser(u.id)}
                            />
                        ))}
                    </View>
                )}

                {activeTab === 'analytics' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ANALYTICS</Text>

                        {/* Simple Bar Chart */}
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>PLAYS PER DAY</Text>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                                const values = [45, 68, 52, 78, 95, 120, 88];
                                const maxVal = Math.max(...values);
                                return (
                                    <View key={day} style={styles.barRow}>
                                        <Text style={styles.barLabel}>{day}</Text>
                                        <View style={styles.barContainer}>
                                            <View
                                                style={[
                                                    styles.bar,
                                                    { width: `${(values[index] / maxVal) * 100}%` }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.barValue}>{values[index]}</Text>
                                    </View>
                                );
                            })}
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
        color: METRO_COLORS.purple,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: METRO_COLORS.gray800,
    },
    tab: {
        marginRight: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: METRO_COLORS.purple,
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.md,
        gap: SPACING.sm,
    },
    statTile: {
        width: '48%',
        aspectRatio: 1.5,
        padding: SPACING.md,
        justifyContent: 'space-between',
    },
    statIcon: {
        opacity: 0.7,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '200',
        color: METRO_COLORS.white,
    },
    statTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: METRO_COLORS.white,
        letterSpacing: 2,
    },
    section: {
        padding: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: METRO_COLORS.gray500,
        letterSpacing: 2,
        marginBottom: SPACING.md,
    },
    addButton: {
        width: 32,
        height: 32,
        backgroundColor: METRO_COLORS.lime,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionTile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: METRO_COLORS.gray800,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        gap: SPACING.md,
    },
    actionTileText: {
        fontSize: 14,
        fontWeight: '500',
        color: METRO_COLORS.white,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: METRO_COLORS.gray800,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    userAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    userInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: METRO_COLORS.white,
    },
    userEmail: {
        fontSize: 11,
        color: METRO_COLORS.gray500,
    },
    roleBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        backgroundColor: METRO_COLORS.gray700,
        marginRight: SPACING.sm,
    },
    roleBadgeAdmin: {
        backgroundColor: METRO_COLORS.purple,
    },
    roleText: {
        fontSize: 9,
        fontWeight: '700',
        color: METRO_COLORS.white,
        letterSpacing: 1,
    },
    actionButton: {
        padding: SPACING.sm,
    },
    chartContainer: {
        backgroundColor: METRO_COLORS.gray800,
        padding: SPACING.md,
    },
    chartTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: METRO_COLORS.cyan,
        letterSpacing: 2,
        marginBottom: SPACING.md,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    barLabel: {
        width: 30,
        fontSize: 10,
        color: METRO_COLORS.gray500,
    },
    barContainer: {
        flex: 1,
        height: 20,
        backgroundColor: METRO_COLORS.gray700,
        marginHorizontal: SPACING.sm,
    },
    bar: {
        height: '100%',
        backgroundColor: METRO_COLORS.cyan,
    },
    barValue: {
        width: 30,
        fontSize: 10,
        color: METRO_COLORS.gray400,
        textAlign: 'right',
    },
    accessDenied: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accessDeniedText: {
        fontSize: 20,
        fontWeight: '700',
        color: METRO_COLORS.magenta,
        marginTop: SPACING.md,
    },
    accessDeniedSubtext: {
        fontSize: 12,
        color: METRO_COLORS.gray500,
        marginTop: SPACING.sm,
    },
});
