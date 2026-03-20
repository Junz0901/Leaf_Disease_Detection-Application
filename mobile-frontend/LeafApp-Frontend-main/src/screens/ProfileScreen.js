import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Platform, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const userName = user?.name || "Guest User";
    const userEmail = user?.email || "guest@leafdoctor.com";
    const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const handleLogout = () => {
        Alert.alert(
            t('logoutConfirmTitle'),
            t('logoutConfirmMessage'),
            [
                { text: t('cancel'), style: "cancel" },
                {
                    text: t('logout'),
                    style: "destructive",
                    onPress: () => {
                        dispatch(logout());
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Auth' }],
                        });
                    }
                }
            ]
        );
    };

    const MenuItem = ({ icon, title, onPress, value, isSwitch, color = "#333" }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={isSwitch ? 1 : 0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#f5f5f5' }]}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text style={[styles.menuItemTitle, { color }]}>{title}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    value={value}
                    onValueChange={onPress}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={value ? "#2E7D32" : "#f4f3f4"}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#e0f7fa', '#f1f8e9', '#ffffff']}
                style={styles.gradientBackground}
            />
            <StatusBar barStyle="dark-content" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            style={styles.avatarGradient}
                        >
                            <Text style={styles.avatarText}>{userInitials}</Text>
                        </LinearGradient>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{userName}</Text>
                    <Text style={styles.email}>{userEmail}</Text>
                    <TouchableOpacity style={styles.editProfileButton}>
                        <Text style={styles.editProfileText}>{t('editProfile')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{t('settings')}</Text>
                    <View style={styles.sectionContent}>
                        <MenuItem
                            icon="earth-outline"
                            title={t('language')}
                            onPress={() => navigation.navigate('LanguageSettings')}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            title={t('notifications')}
                            isSwitch
                            value={notificationsEnabled}
                            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                        />
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{t('support')}</Text>
                    <View style={styles.sectionContent}>
                        <MenuItem
                            icon="help-circle-outline"
                            title={t('helpCenter')}
                            onPress={() => navigation.navigate('HelpCenter')}
                        />
                        <MenuItem
                            icon="information-circle-outline"
                            title={t('about')}
                            onPress={() => navigation.navigate('About')}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
                    <Text style={styles.logoutText}>{t('logout')}</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>{t('version')} 1.0.0</Text>
            </ScrollView>
        </View>
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
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    avatarText: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2E7D32',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    editProfileButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(46, 125, 50, 0.2)',
    },
    editProfileText: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: 14,
    },
    sectionContainer: {
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginLeft: 5,
    },
    sectionContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuItemTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffebee',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
    },
    logoutText: {
        color: '#d32f2f',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: '#bbb',
        fontSize: 12,
    },
});

export default ProfileScreen;
