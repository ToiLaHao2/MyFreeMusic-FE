import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { METRO_COLORS, SPACING } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.replace('/');
        } else {
            Alert.alert('Login Failed', "Invalid credentials. Use 'password' for demo.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Branding */}
                <View style={styles.branding}>
                    <Text style={styles.logo}>🎵</Text>
                    <Text style={styles.title}>
                        MY<Text style={styles.titleAccent}>FREE</Text>MUSIC
                    </Text>
                    <Text style={styles.subtitle}>Your personal music streaming</Text>
                </View>

                {/* Login Form */}
                <View style={styles.form}>
                    <Text style={styles.formTitle}>
                        SIGN <Text style={styles.formAccent}>IN</Text>
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="user@myfreemusic.com"
                            placeholderTextColor={METRO_COLORS.gray600}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={METRO_COLORS.gray600}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={METRO_COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>SIGN IN</Text>
                        )}
                    </TouchableOpacity>

                    {/* Demo Credentials */}
                    <View style={styles.demoBox}>
                        <Text style={styles.demoTitle}>DEMO ACCOUNTS</Text>
                        <Text style={styles.demoText}>👤 user@myfreemusic.com / password</Text>
                        <Text style={styles.demoText}>👑 admin@myfreemusic.com / password</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: METRO_COLORS.dark,
    },
    scrollContent: {
        flexGrow: 1,
    },
    branding: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: METRO_COLORS.cyan,
        paddingVertical: SPACING.xl,
        minHeight: 200,
    },
    logo: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: 32,
        fontWeight: '200',
        color: METRO_COLORS.white,
        letterSpacing: 4,
    },
    titleAccent: {
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.sm,
    },
    form: {
        flex: 1,
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: '200',
        color: METRO_COLORS.white,
        letterSpacing: 2,
        marginBottom: SPACING.lg,
    },
    formAccent: {
        fontWeight: '700',
        color: METRO_COLORS.cyan,
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: METRO_COLORS.cyan,
        letterSpacing: 2,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: METRO_COLORS.gray800,
        borderLeftWidth: 4,
        borderLeftColor: METRO_COLORS.gray700,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: 16,
        color: METRO_COLORS.white,
    },
    button: {
        backgroundColor: METRO_COLORS.cyan,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '700',
        color: METRO_COLORS.white,
        letterSpacing: 2,
    },
    demoBox: {
        marginTop: SPACING.xl,
        padding: SPACING.md,
        backgroundColor: METRO_COLORS.gray800,
        borderLeftWidth: 4,
        borderLeftColor: METRO_COLORS.orange,
    },
    demoTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: METRO_COLORS.orange,
        letterSpacing: 2,
        marginBottom: SPACING.sm,
    },
    demoText: {
        fontSize: 12,
        color: METRO_COLORS.gray400,
        fontFamily: 'monospace',
        marginVertical: 2,
    },
});
