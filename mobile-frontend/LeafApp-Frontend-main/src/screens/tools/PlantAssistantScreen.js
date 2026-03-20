import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const PlantAssistantScreen = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! I\'m your AI Plant Assistant. Ask me anything about gardening!', sender: 'bot' },
    ]);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (inputText.trim().length === 0) return;

        const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Mock bot response
        setTimeout(() => {
            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: 'That is a great question! Based on my data, regular pruning encourages healthy growth.',
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    const renderItem = ({ item }) => (
        <View style={[
            styles.messageRow,
            item.sender === 'user' ? styles.userRow : styles.botRow
        ]}>
            {item.sender === 'bot' && (
                <View style={styles.botAvatar}>
                    <Ionicons name="happy-outline" size={20} color="#2e7d32" />
                </View>
            )}

            <View style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    item.sender === 'user' ? styles.userMessageText : styles.botMessageText
                ]}>{item.text}</Text>
            </View>

            {item.sender === 'user' && (
                <View style={styles.userAvatar}>
                    <Ionicons name="person-outline" size={20} color="#555" />
                </View>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={['#e0f7fa', '#e8f5e9', '#ffffff']}
                style={styles.gradientBackground}
            />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>AI ASSISTANT</Text>
                </View>
                <Text style={styles.headerTitle}>Ask the Expert</Text>
            </View>

            {/* Chat Area */}
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your question..."
                    placeholderTextColor="#999"
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    header: {
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 20,
    },
    aiBadge: {
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#b2dfdb',
        marginBottom: 10,
    },
    aiBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#00695c',
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#003300',
    },
    list: {
        flex: 1,
        paddingHorizontal: 15,
    },
    listContent: {
        paddingBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    botRow: {
        justifyContent: 'flex-start',
    },
    botAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#d6f0d9', // lighter green
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f1f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 15,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    botBubble: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#00bf63',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    botMessageText: {
        color: '#333',
    },
    userMessageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        marginBottom: 80, // Space for tab bar
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        maxHeight: 100,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
        color: '#333',
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#66bb6a',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#66bb6a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
});

export default PlantAssistantScreen;
