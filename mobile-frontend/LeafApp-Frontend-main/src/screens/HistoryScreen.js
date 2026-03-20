import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HistoryScreen = () => {
    const { t } = useTranslation();
    const history = useSelector((state) => state.plant.history);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.diseaseName} numberOfLines={1}>{item.diseaseName}</Text>
                    <View style={styles.confidenceBadge}>
                        <Text style={styles.confidenceText}>{(item.confidence * 100).toFixed(0)}%</Text>
                    </View>
                </View>
                <Text style={styles.date}>
                    <Ionicons name="calendar-outline" size={12} color="#666" /> {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={styles.treatmentPreview} numberOfLines={2}>
                    {item.treatment || t('noTreatmentInfo')}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#e0f7fa', '#f1f8e9', '#ffffff']}
                style={styles.gradientBackground}
            />
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('scanHistory')}</Text>
                <Text style={styles.headerSubtitle}>{t('scanHistorySubtitle')}</Text>
            </View>

            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="leaf-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>{t('noScans')}</Text>
                    <Text style={styles.emptySubText}>{t('startScanning')}</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#e8f5e9', // Light green background
        // Removed borders and shadows to remove "box" look
        paddingBottom: 25,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1b5e20',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    listContainer: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    image: {
        width: 100,
        height: '100%',
        backgroundColor: '#eee',
    },
    infoContainer: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    diseaseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    confidenceBadge: {
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    confidenceText: {
        fontSize: 12,
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    treatmentPreview: {
        fontSize: 13,
        color: '#555',
        lineHeight: 18,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#888',
        marginTop: 20,
    },
    emptySubText: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default HistoryScreen;
