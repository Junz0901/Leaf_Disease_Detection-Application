import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanPlantScreen from '../screens/ScanPlantScreen';
import AnalysisResultsScreen from '../screens/AnalysisResultsScreen';

const Stack = createNativeStackNavigator();

const PlantNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ScanPlant" component={ScanPlantScreen} />
            <Stack.Screen name="AnalysisResults" component={AnalysisResultsScreen} />
        </Stack.Navigator>
    );
};

export default PlantNavigator;
