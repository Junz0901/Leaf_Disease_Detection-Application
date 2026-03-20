import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from 'react-i18next';

const FertilizerCalculatorScreen = () => {
    const { t } = useTranslation();
    const [area, setArea] = useState('');
    const [plantType, setPlantType] = useState(null);
    const [growthStage, setGrowthStage] = useState(null);
    const [result, setResult] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const plantTypes = [
        { id: '1', name: 'Tomatoes', label: t('plantTomatoes') },
        { id: '2', name: 'Roses', label: t('plantRoses') },
        { id: '3', name: 'Indoor Plants', label: t('plantIndoor') },
        { id: '4', name: 'Vegetables', label: t('plantVegetables') },
        { id: '5', name: 'Lawns', label: t('plantLawns') },
    ];

    const growthStages = [
        { value: 'Seedling', label: t('stageSeedling') },
        { value: 'Vegetative', label: t('stageVegetative') },
        { value: 'Flowering', label: t('stageFlowering') },
        { value: 'Dormant', label: t('stageDormant') }
    ];

    const calculate = () => {
        if (!plantType) {
            Alert.alert(t('missingInfo'), t('missingPlantType'));
            return;
        }
        if (!growthStage) {
            Alert.alert(t('missingInfo'), t('missingGrowthStage'));
            return;
        }
        const areaNum = parseFloat(area);
        if (isNaN(areaNum) || areaNum <= 0) {
            Alert.alert(t('invalidInput'), t('invalidAreaMessage'));
            return;
        }

        // Mock calculation logic based on inputs
        let baseRate = 2; // kg per 100 sq ft
        if (growthStage.value === 'Seedling') baseRate = 0.5;
        if (growthStage.value === 'Flowering') baseRate = 3;

        const amount = (areaNum / 100) * baseRate;
        setResult(amount.toFixed(2));
    };

    const renderPlantItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                setPlantType(item);
                setModalVisible(false);
            }}
        >
            <Text style={styles.modalItemText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={styles.iconBox}>
                    <Ionicons name="calculator" size={24} color="#2e7d32" />
                </View>
                <View>
                    <Text style={styles.headerTitle}>{t('smartDosing')}</Text>
                    <Text style={styles.headerSubtitle}>{t('smartDosingSubtitle')}</Text>
                </View>
            </View>

            {/* Plant Type Selection */}
            <Text style={styles.sectionLabel}>
                <Ionicons name="leaf-outline" size={16} color="#2e7d32" /> {t('plantType')}
            </Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
                <Text style={[styles.dropdownText, !plantType && styles.placeholderText]}>
                    {plantType ? plantType.label : t('selectPlantPlaceholder')}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Growth Stage Selection */}
            <Text style={styles.sectionLabel}>
                <Ionicons name="time-outline" size={16} color="#2e7d32" /> {t('growthStage')}
            </Text>
            <View style={styles.chipsContainer}>
                {growthStages.map((stage) => (
                    <TouchableOpacity
                        key={stage.value}
                        style={[
                            styles.chip,
                            growthStage?.value === stage.value && styles.activeChip
                        ]}
                        onPress={() => setGrowthStage(stage)}
                    >
                        <Text style={[
                            styles.chipText,
                            growthStage?.value === stage.value && styles.activeChipText
                        ]}>{stage.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Garden Area Input */}
            <Text style={styles.sectionLabel}>
                <Ionicons name="resize-outline" size={16} color="#2e7d32" /> {t('gardenArea')}
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={area}
                    onChangeText={setArea}
                    placeholder={t('areaPlaceholder')}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
                <Text style={styles.calculateButtonText}>{t('calculateDosage')}</Text>
            </TouchableOpacity>

            {/* Result */}
            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>{t('recommendedAmount')}</Text>
                    <Text style={styles.resultValue}>{result} kg</Text>
                    <Text style={styles.resultNote}>{t('resultNote', { plant: plantType?.label, stage: growthStage?.label })}</Text>
                </View>
            )}

            {/* Plant Type Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('selectPlantType')}</Text>
                        <FlatList
                            data={plantTypes}
                            keyExtractor={(item) => item.id}
                            renderItem={renderPlantItem}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0f7fa', // Light mint bg
    },
    contentContainer: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 100,
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#2e7d32',
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#004d40',
        marginBottom: 10,
        marginTop: 10,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#b2dfdb',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#999',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    chip: {
        flexBasis: '48%',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#b2dfdb',
        borderRadius: 12,
        alignItems: 'center',
    },
    activeChip: {
        backgroundColor: '#e8f5e9',
        borderColor: '#2e7d32',
    },
    chipText: {
        color: '#004d40',
        fontWeight: '500',
    },
    activeChipText: {
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 25,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#b2dfdb',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    calculateButton: {
        backgroundColor: '#6b8e88', // Muted green/grey from screenshot
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    calculateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    resultContainer: {
        marginTop: 30,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#b2dfdb',
    },
    resultLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    resultValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 5,
    },
    resultNote: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#2e7d32',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});

export default FertilizerCalculatorScreen;
