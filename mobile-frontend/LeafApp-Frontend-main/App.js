import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/i18n'; // Initialize i18n
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/redux/store';

// We need to create the store first, but for now I'll create a dummy one if it doesn't exist
// actually I'll create the store file next.

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <RootNavigator />
          <StatusBar style="auto" />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
