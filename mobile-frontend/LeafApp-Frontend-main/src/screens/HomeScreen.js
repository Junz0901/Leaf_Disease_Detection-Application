import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Platform, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const [langModalVisible, setLangModalVisible] = useState(false);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLangModalVisible(false);
    };

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'gu', label: 'ગુજરાતી' },
    ];

    const currentLangLabel = languages.find(l => l.code === i18n.language)?.label || 'Language';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={['#e0f7fa', '#e8f5e9', '#ffffff']}
                style={styles.gradientBackground}
            />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="leaf" size={24} color="#2E7D32" />
                    <Text style={styles.logoText}>LeafDoctor</Text>
                </View>



                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.langButton}
                        onPress={() => setLangModalVisible(true)}
                    >
                        <Ionicons name="globe-outline" size={16} color="#2E7D32" />
                        <Text style={styles.langButtonText}>{currentLangLabel}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={styles.signInText}>{t('profile')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.aiBadge}>
                        <Text style={styles.aiBadgeText}>AI-POWERED DIAGNOSIS</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        {t('hero_title').split(' ').map((word, index) => (
                            <Text key={index} style={index % 2 !== 0 && index < 3 ? styles.greenText : styles.darkText}>
                                {word} {' '}
                            </Text>
                        ))}
                    </Text>

                    <Text style={styles.heroSubtitle}>
                        {t('hero_subtitle')}
                    </Text>
                </View>

                {/* Main Action Card */}
                <TouchableOpacity
                    style={styles.uploadCard}
                    onPress={() => navigation.navigate('Scan')}
                >
                    <View style={styles.dashedBorder}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="cloud-upload-outline" size={32} color="#2E7D32" />
                        </View>
                        <Text style={styles.uploadText}>{t('upload_text')}</Text>
                    </View>
                </TouchableOpacity>


            </ScrollView>

            {/* Language Modal */}
            <Modal
                transparent={true}
                visible={langModalVisible}
                animationType="fade"
                onRequestClose={() => setLangModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setLangModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={styles.modalItem}
                                onPress={() => changeLanguage(lang.code)}
                            >
                                <Text style={[
                                    styles.modalItemText,
                                    i18n.language === lang.code && styles.activeLang
                                ]}>
                                    {lang.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1b5e20',
        marginLeft: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLink: {
        marginRight: 15,
    },
    headerLinkText: {
        color: '#2E7D32',
        fontWeight: '600',
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    langButtonText: {
        marginLeft: 5,
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: 12,
    },
    signInButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    signInText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100, // Space for custom tab bar
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    aiBadge: {
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20,
    },
    aiBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2E7D32',
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 70, // Increased significantly to avoid clipping
        paddingHorizontal: 10,
        color: '#1b5e20',
        marginBottom: 20,
    },
    darkText: {
        color: '#003300',
    },
    greenText: {
        color: '#00bf63', // Bright mint green/emerald
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 24,
    },
    uploadCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        height: 200,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    dashedBorder: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#a5d6a7',
        borderStyle: 'dashed',
        borderRadius: 20,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f8e9',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    uploadText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    pillsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 30,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00bf63',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        shadowColor: '#00bf63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    pillLight: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    pillText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    pillTextDark: {
        color: '#2E7D32',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    activeLang: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
