import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageSettingsScreen from '../screens/settings/LanguageSettingsScreen';
import HelpCenterScreen from '../screens/settings/HelpCenterScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator>
            <Stack.Screen name="UserProfile" component={ProfileScreen} options={{ headerTitle: t('profile') }} />
            <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} options={{ title: 'Language' }} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: 'Help Center' }} />
            <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About LeafDoctor' }} />
        </Stack.Navigator>
    );
};

export default ProfileNavigator;
