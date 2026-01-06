import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { METRO_COLORS, SPACING } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const MenuItem = ({ icon, label, color = METRO_COLORS.gray400, onPress }: any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <Text style={styles.menuIcon}>{icon}</Text>
            <Text style={[styles.menuLabel, { color }]}>{label}</Text>
            <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        MY <Text style={styles.headerAccent}>PROFILE</Text>
                    </Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    {user?.profilePicture ? (
                        <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarText}>
                                {user?.fullName?.charAt(0) || '?'}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.userName}>{user?.fullName || 'Guest'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'Not logged in'}</Text>
                    <View style={[
                        styles.roleBadge,
                        { backgroundColor: user?.role === 'ADMIN' ? METRO_COLORS.purple : METRO_COLORS.gray700 }
                    ]}>
                        <Text style={styles.roleText}>{user?.role || 'GUEST'}</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>24</Text>
                        <Text style={styles.statLabel}>PLAYLISTS</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>156</Text>
                        <Text style={styles.statLabel}>SONGS</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12h</Text>
                        <Text style={styles.statLabel}>LISTENED</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menu}>
                    <MenuItem icon="⚙️" label="Settings" />
                    <MenuItem icon="🎨" label="Theme" />
                    <MenuItem icon="🔔" label="Notifications" />
                    <MenuItem icon="📱" label="Local Storage" />
                    <MenuItem icon="☁️" label="Server Sync" />
                    <MenuItem
                        icon="🚪"
                        label="Logout"
                        color={METRO_COLORS.magenta}
                        onPress={handleLogout}
                    />
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
        color: METRO_COLORS.lime,
    },
    profileCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        marginHorizontal: SPACING.lg,
        backgroundColor: METRO_COLORS.gray800,
        marginBottom: SPACING.lg,
    },
    avatar: {
        width: 100,
        height: 100,
        marginBottom: SPACING.md,
    },
    avatarPlaceholder: {
        backgroundColor: METRO_COLORS.cyan,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '200',
        color: METRO_COLORS.white,
    },
    userName: {
        fontSize: 24,
        fontWeight: '600',
        color: METRO_COLORS.white,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: METRO_COLORS.gray500,
        marginBottom: SPACING.md,
    },
    roleBadge: {
        paddingVertical: 4,
        paddingHorizontal: SPACING.md,
    },
    roleText: {
        fontSize: 10,
        fontWeight: '700',
        color: METRO_COLORS.white,
        letterSpacing: 2,
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SPACING.md,
        backgroundColor: METRO_COLORS.gray800,
        marginHorizontal: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '200',
        color: METRO_COLORS.cyan,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: METRO_COLORS.gray500,
        letterSpacing: 1,
    },
    menu: {
        marginHorizontal: SPACING.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: METRO_COLORS.gray800,
    },
    menuIcon: {
        fontSize: 18,
        marginRight: SPACING.md,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    menuArrow: {
        fontSize: 24,
        color: METRO_COLORS.gray600,
    },
});
