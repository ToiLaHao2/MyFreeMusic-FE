import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { METRO_COLORS, SPACING } from '../../constants/colors';

export default function UploadScreen() {
    const router = useRouter();
    const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
            });

            if (!result.canceled && result.assets?.[0]) {
                setSelectedFile(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick file');
        }
    };

    const handleUpload = () => {
        if (uploadType === 'file' && !selectedFile) {
            Alert.alert('Error', 'Please select a file first');
            return;
        }
        if (uploadType === 'youtube' && !youtubeUrl) {
            Alert.alert('Error', 'Please enter a YouTube URL');
            return;
        }

        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            Alert.alert('Success', 'Upload completed! (Mock)', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }, 2000);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        UPLOAD <Text style={styles.headerAccent}>MUSIC</Text>
                    </Text>
                </View>

                {/* Upload Type Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, uploadType === 'file' && styles.tabActive]}
                        onPress={() => setUploadType('file')}
                    >
                        <Ionicons
                            name="document-outline"
                            size={20}
                            color={uploadType === 'file' ? METRO_COLORS.white : METRO_COLORS.gray500}
                        />
                        <Text style={[styles.tabText, uploadType === 'file' && styles.tabTextActive]}>
                            FILE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, uploadType === 'youtube' && styles.tabActive]}
                        onPress={() => setUploadType('youtube')}
                    >
                        <Ionicons
                            name="logo-youtube"
                            size={20}
                            color={uploadType === 'youtube' ? METRO_COLORS.white : METRO_COLORS.gray500}
                        />
                        <Text style={[styles.tabText, uploadType === 'youtube' && styles.tabTextActive]}>
                            YOUTUBE
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {uploadType === 'file' ? (
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.uploadBox} onPress={handleFilePick}>
                            {selectedFile ? (
                                <>
                                    <Ionicons name="musical-notes" size={48} color={METRO_COLORS.lime} />
                                    <Text style={styles.uploadFileName}>{selectedFile.name}</Text>
                                    <Text style={styles.uploadHint}>Tap to change</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="cloud-upload-outline" size={64} color={METRO_COLORS.cyan} />
                                    <Text style={styles.uploadText}>Tap to select audio file</Text>
                                    <Text style={styles.uploadHint}>MP3, FLAC, WAV supported</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.section}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>YOUTUBE URL</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="https://youtube.com/watch?v=..."
                                placeholderTextColor={METRO_COLORS.gray600}
                                value={youtubeUrl}
                                onChangeText={setYoutubeUrl}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {youtubeUrl && (
                            <View style={styles.previewBox}>
                                <Ionicons name="logo-youtube" size={40} color={METRO_COLORS.magenta} />
                                <Text style={styles.previewText}>Video preview will appear here</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Upload Button */}
                <TouchableOpacity
                    style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
                    onPress={handleUpload}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <Text style={styles.uploadButtonText}>UPLOADING...</Text>
                    ) : (
                        <>
                            <Ionicons name="cloud-upload" size={24} color={METRO_COLORS.white} />
                            <Text style={styles.uploadButtonText}>UPLOAD</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
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
    tabs: {
        flexDirection: 'row',
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        backgroundColor: METRO_COLORS.gray800,
        gap: SPACING.sm,
    },
    tabActive: {
        backgroundColor: METRO_COLORS.cyan,
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
        paddingHorizontal: SPACING.lg,
    },
    uploadBox: {
        height: 200,
        backgroundColor: METRO_COLORS.gray800,
        borderWidth: 2,
        borderColor: METRO_COLORS.gray700,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 16,
        color: METRO_COLORS.white,
        marginTop: SPACING.md,
    },
    uploadFileName: {
        fontSize: 14,
        color: METRO_COLORS.white,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    uploadHint: {
        fontSize: 12,
        color: METRO_COLORS.gray500,
        marginTop: SPACING.sm,
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
        fontSize: 14,
        color: METRO_COLORS.white,
    },
    previewBox: {
        height: 120,
        backgroundColor: METRO_COLORS.gray800,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewText: {
        fontSize: 12,
        color: METRO_COLORS.gray500,
        marginTop: SPACING.sm,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: METRO_COLORS.lime,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.xl,
        marginBottom: SPACING.xxl,
        paddingVertical: SPACING.md,
        gap: SPACING.sm,
    },
    uploadButtonDisabled: {
        backgroundColor: METRO_COLORS.gray700,
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: METRO_COLORS.white,
        letterSpacing: 2,
    },
});
