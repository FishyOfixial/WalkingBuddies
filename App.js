import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen.js';
import AskForBuddyScreen from './screens/askForBuddyScreen.js';
import dashboardScreen from './screens/dashboardScreen.js';
import historyScreen from './screens/historyScreen.js';
import statScreen from './screens/statScreen.js';
import profileScreen from './screens/profileScreen.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AskBuddy" component={AskForBuddyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={dashboardScreen} options={{headerShown: false}} />
        <Stack.Screen name="Stats" component={statScreen} options={{headerShown: false}} />
        <Stack.Screen name="History" component={historyScreen} options={{headerShown: false}} />
        <Stack.Screen name="Profile" component={profileScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}