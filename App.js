import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/loginScreen.js';
import RegisterScreen from './screens/registerScreen.js';
import AskForBuddyScreen from './screens/askForBuddyScreen.js';
import HistoryScreen from './screens/historyScreen.js';
import StatScreen from './screens/statScreen.js';
import ProfileScreen from './screens/profileScreen.js';
import SlideInMenu from './screens/slideInMenuScreen.js';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AskBuddy" component={AskForBuddyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Stats" component={StatScreen} options={{headerShown: false}} />
        <Stack.Screen name="History" component={HistoryScreen} options={{headerShown: false}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
        <Stack.Screen name="SlideIn" component={SlideInMenu} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}