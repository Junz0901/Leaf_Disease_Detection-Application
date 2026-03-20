import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import PlantNavigator from './PlantNavigator';
import PlantAssistantScreen from '../screens/tools/PlantAssistantScreen';
import ProfileNavigator from './ProfileNavigator';

import FertilizerCalculatorScreen from '../screens/tools/FertilizerCalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';

// Placeholders for other tabs
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ name }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{name}</Text>
    </View>
);

const Tab = createBottomTabNavigator();

import CustomTabBar from '../components/CustomTabBar';

const AppNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                }
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Scan" component={PlantNavigator} />
            <Tab.Screen name="Tools" component={FertilizerCalculatorScreen} />
            <Tab.Screen name="Chat" component={PlantAssistantScreen} />

            {/* Hidden tabs (accessible via other means) */}
            <Tab.Screen
                name="History"
                component={HistoryScreen}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{ tabBarButton: () => null }}
            />
        </Tab.Navigator>
    );
};

export default AppNavigator;
