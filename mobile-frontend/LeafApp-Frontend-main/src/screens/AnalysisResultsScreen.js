import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Animated, Modal, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToHistory } from '../redux/slices/plantSlice';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AnalysisResultsScreen = ({ route, navigation }) => {
    const { imageUri } = route.params;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    // Real analysis result via API from backend
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Feedback form state
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackName, setFeedbackName] = useState('');
    const [feedbackCause, setFeedbackCause] = useState('');
    const [feedbackTreatment, setFeedbackTreatment] = useState('');

    // Animation state
    const scanAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            scanAnim.setValue(0);
        }
    }, [loading]);

    const analyzeImage = async () => {
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append("file", {
                uri: imageUri,
                name: "photo.jpg",
                type: "image/jpeg"
            });
            
            if (user && user.email) {
                formData.append("user_email", user.email);
            }

            // Use your computer's local network IP to safely test on a physical phone.
            const apiUrl = 'https://angry-games-trade.loca.lt/predict';
            
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error("Failed to scan image");
            }
            
            const data = await response.json();
            
            let resultData;
            const confidenceVal = data.confidence || 0;
            const isHealthy = data.disease && data.disease.toLowerCase().includes('healthy');
            const isUnknown = confidenceVal < 0.2; // Example threshold for unknown
            
            if (isUnknown) {
                setResult({ status: 'unknown', confidence: confidenceVal });
                setLoading(false);
                return;
            } else if (isHealthy) {
                resultData = {
                    status: 'healthy',
                    disease: data.disease,
                    confidence: confidenceVal,
                    treatment: data.llm_explanation || 'Healthy plant.'
                };
            } else {
                // Disease detected
                // Extracting cause and treatment from LLM explanation roughly, as LLM usually describes it.
                // You can also change the backend to return structured JSON instead.
                resultData = {
                    status: 'detected',
                    disease: data.disease,
                    confidence: confidenceVal,
                    cause: 'Based on diagnosis...',
                    treatment: data.llm_explanation || 'Please follow typical care instructions.'
                };
            }

            setResult(resultData);

            // Save to local History
            dispatch(addToHistory({
                imageUri,
                diseaseName: resultData.disease,
                confidence: resultData.confidence,
                treatment: resultData.treatment,
                date: new Date().toISOString(),
            }));
            
        } catch (error) {
            console.error("Scan error: ", error);
            Alert.alert("Scan Failed", "Could not connect to the backend server. Make sure your FastAPI server is running.");
            setResult({ status: 'unknown', confidence: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        analyzeImage();
    }, []);

    const handleSubmitFeedback = () => {
        if (!feedbackName || feedbackName.trim() === '') {
            Alert.alert(t('error') || 'Error', 'Please enter a disease or plant name before submitting.');
            return;
        }

        const finalCause = feedbackCause.trim() || 'Not provided';
        const finalTreatment = feedbackTreatment.trim() || 'Not provided';

        // Add feedback to history
        dispatch(addToHistory({
            imageUri,
            diseaseName: feedbackName.trim() + " (User Feedback)", // Mark it as user feedback
            confidence: 1, // 100% confidence since user specified it
            cause: finalCause,
            treatment: finalTreatment,
            status: 'admin_review_pending',
            date: new Date().toISOString(),
        }));

        Alert.alert(t('thankYou') || 'Thank You', t('feedbackSubmitted') || 'Your feedback has been submitted to admins.');
        setFeedbackName('');
        setFeedbackCause('');
        setFeedbackTreatment('');
        setShowFeedback(false);
        navigation.navigate('Home');
    };

    if (loading) {
        const translateY = scanAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 296] // moving across 300px image height minus line thickness
        });

        return (
            <View style={styles.container}>
                <LinearGradient colors={['#e0f7fa', '#f1f8e9', '#ffffff']} style={styles.gradientBackground} />
                <View style={[styles.header, { padding: 20, paddingTop: 50 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('analyzing')}</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.scanContainer}>
                    <Image source={{ uri: imageUri }} style={styles.scanImage} />
                    <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />

                    <View style={styles.scanOverlay}>
                        <View style={styles.iconPulseCircle}>
                            <Ionicons name="scan-outline" size={48} color="#2E7D32" />
                        </View>
                        <Text style={styles.scanText}>{t('analyzing')}...</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#e0f7fa', '#f1f8e9', '#ffffff']}
                style={styles.gradientBackground}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('analysisResults')}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>

                {result?.status === 'detected' && (
                    <View style={styles.card}>
                        <View style={styles.resultHeader}>
                            <Ionicons name="alert-circle" size={28} color="#d32f2f" />
                            <Text style={styles.diseaseName}>{result.disease}</Text>
                        </View>

                        <View style={styles.confidenceBadge}>
                            <Text style={styles.confidenceText}>{(t('confidence') || 'Confidence')}: {(result.confidence * 100).toFixed(0)}%</Text>
                        </View>

                        <View style={styles.divider} />

                        {result.cause && (
                            <>
                                <Text style={styles.sectionTitle}>{(t('cause') || 'Cause / Reason')}</Text>
                                <Text style={styles.descriptionText}>{result.cause}</Text>
                                <View style={{ height: 15 }} />
                            </>
                        )}

                        <Text style={styles.sectionTitle}>{(t('treatment') || 'Treatment')}</Text>
                        <Text style={styles.descriptionText}>{result.treatment}</Text>
                    </View>
                )}

                {result?.status === 'healthy' && (
                    <View style={styles.card}>
                        <View style={styles.resultHeader}>
                            <Ionicons name="checkmark-circle" size={28} color="#2E7D32" />
                            <Text style={[styles.diseaseName, { color: '#2E7D32' }]}>{result.disease}</Text>
                        </View>

                        <View style={styles.confidenceBadge}>
                            <Text style={styles.confidenceText}>{t('confidence')}: {(result.confidence * 100).toFixed(0)}%</Text>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>{t('status') || 'Status'}</Text>
                        <Text style={styles.descriptionText}>{result.treatment}</Text>
                    </View>
                )}

                {result?.status === 'unknown' && (
                    <View style={[styles.card, styles.warningCard]}>
                        <Ionicons name="help-circle-outline" size={48} color="#e65100" />
                        <Text style={styles.warningText}>{t('couldNotIdentify')}</Text>
                        <TouchableOpacity style={styles.outlineButton} onPress={() => setShowFeedback(true)}>
                            <Text style={styles.outlineButtonText}>{t('submitFeedback')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Feedback is now rendered in a modal below */}

                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="scan-outline" size={20} color="#2E7D32" />
                        <Text style={styles.secondaryButtonText}>{t('scanAgain')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.primaryButtonText}>{t('goHome')}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <Modal
                visible={showFeedback}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowFeedback(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('feedbackForm') || 'Feedback Form'}</Text>
                            <TouchableOpacity onPress={() => setShowFeedback(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>{t('whatIsThisPlant') || 'Plant/Disease Name'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Tomato Blight"
                                value={feedbackName}
                                onChangeText={setFeedbackName}
                                autoFocus={true}
                            />

                            <Text style={styles.label}>{t('cause') || 'Cause / Reason'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Why did this happen?"
                                value={feedbackCause}
                                onChangeText={setFeedbackCause}
                            />

                            <Text style={styles.label}>{t('treatment') || 'Treatment'}</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                placeholder="How to treat it?"
                                multiline
                                textAlignVertical="top"
                                value={feedbackTreatment}
                                onChangeText={setFeedbackTreatment}
                            />

                            <TouchableOpacity style={[styles.primaryButton, { marginLeft: 0, marginTop: 10 }]} onPress={handleSubmitFeedback}>
                                <Text style={[styles.primaryButtonText, { color: 'white' }]}>{t('submit') || 'Submit'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    warningCard: {
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#e65100',
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    diseaseName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginLeft: 10,
        flex: 1,
    },
    confidenceBadge: {
        backgroundColor: '#e8f5e9',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 15,
    },
    confidenceText: {
        fontSize: 12,
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    warningText: {
        color: '#e65100',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    primaryButton: {
        backgroundColor: '#2E7D32',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#2E7D32',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: '#2E7D32',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    outlineButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e65100',
    },
    outlineButtonText: {
        color: '#e65100',
        fontWeight: 'bold',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    scanContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative',
    },
    scanImage: {
        width: '100%',
        height: 300,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    scanLine: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        height: 4,
        backgroundColor: '#00bf63',
        borderRadius: 2,
        shadowColor: '#00bf63',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 5,
    },
    scanOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 20,
        marginHorizontal: 20,
    },
    iconPulseCircle: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 20,
        borderRadius: 50,
        marginBottom: 10,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    scanText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AnalysisResultsScreen;
