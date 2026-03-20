import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const HelpCenterScreen = ({ navigation }) => {
    const { t } = useTranslation();

    const FAQItem = ({ question, answer }) => (
        <View style={styles.faqItem}>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.answer}>{answer}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>How can we help?</Text>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <FAQItem
                    question="How do I scan a plant?"
                    answer="Go to the 'Scan' tab, align your plant in the frame, and tap the capture button. The AI will analyze the image."
                />
                <FAQItem
                    question="How precise is the fertilizer calculator?"
                    answer="Our calculator provides estimates based on general guidelines. Always verify with your specific product instructions."
                />
                <FAQItem
                    question="Can I save my scan results?"
                    answer="Yes, all your scans are automatically saved to the 'History' tab for future reference."
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 30,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 15,
    },
    faqItem: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 5,
    },
    answer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    contactButton: {
        backgroundColor: '#2E7D32',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 40,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default HelpCenterScreen;
