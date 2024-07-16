import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import AddPatientScreen from './screens/AddPatientScreen';
import PatientChartScreen from './screens/PatientChartScreen';
import DoctorSignupScreen from './screens/DoctorSignupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientChart" component={PatientChartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DoctorSignup" component={DoctorSignupScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
