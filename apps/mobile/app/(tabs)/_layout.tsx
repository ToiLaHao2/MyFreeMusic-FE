import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { METRO_COLORS } from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';

// Metro-style tab icon with square background when active
const MetroTabIcon = ({
    iconName,
    focused
}: {
    iconName: keyof typeof Ionicons.glyphMap;
    focused: boolean;
}) => {
    return (
        <View style={[
            styles.iconWrapper,
            focused && styles.iconWrapperActive
        ]}>
            <Ionicons
                name={iconName}
                size={22}
                color={focused ? METRO_COLORS.white : METRO_COLORS.gray500}
            />
        </View>
    );
};

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: 60 + Math.max(insets.bottom, 8),
                        paddingBottom: Math.max(insets.bottom, 8),
                    }
                ],
                tabBarActiveTintColor: METRO_COLORS.white,
                tabBarInactiveTintColor: METRO_COLORS.gray500,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'HOME',
                    tabBarIcon: ({ focused }) => (
                        <MetroTabIcon iconName="home-outline" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'SEARCH',
                    tabBarIcon: ({ focused }) => (
                        <MetroTabIcon iconName="search-outline" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: 'UPLOAD',
                    tabBarIcon: ({ focused }) => (
                        <MetroTabIcon iconName="cloud-upload-outline" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'LIBRARY',
                    tabBarIcon: ({ focused }) => (
                        <MetroTabIcon iconName="musical-notes-outline" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: 'SOCIAL',
                    tabBarIcon: ({ focused }) => (
                        <MetroTabIcon iconName="globe-outline" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'ADMIN',
                    tabBarIcon: ({ focused }) => (
                        <MetroTabIcon iconName="settings-outline" focused={focused} />
                    ),
                    href: isAdmin ? '/admin' : null, // Only show for admins
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'ME',
                    tabBarIcon: ({ focused }) => (
                        <MetroTabIcon iconName="person-outline" focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: METRO_COLORS.dark,
        borderTopWidth: 0,
        paddingTop: 6,
        elevation: 0,
        shadowOpacity: 0,
    },
    tabLabel: {
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapperActive: {
        backgroundColor: METRO_COLORS.cyan,
    },
});
