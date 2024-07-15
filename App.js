//import React, { useState } from 'react';
//import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
//
//const Stack = createNativeStackNavigator();
//
//function LoginScreen({ navigation }) {
//  const [name, setName] = useState('');
//  const [password, setPassword] = useState('');
//
//  const handleLogin = async () => {
//    try {
//      const response = await fetch('http://192.168.2.25:3000/login', {
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/json',
//        },
//        body: JSON.stringify({ name, password }),
//      });
//
//      const result = await response.json();
//
//      if (response.status === 200) {
//        Alert.alert('Login Successful', result.message, [
//          { text: 'OK', onPress: () => navigation.navigate('Main') }
//        ]);
//      } else {
//        Alert.alert('Login Failed', result.message);
//      }
//    } catch (error) {
//      console.error(error);
//      Alert.alert('Error', 'Something went wrong');
//    }
//  };
//
//  return (
//    <View style={styles.container}>
//      <Image source={{ uri: 'https://cdn4.iconfinder.com/data/icons/medical-and-health-121/68/84-512.png' }} style={styles.logo} />
//      <Text style={styles.header}>Login</Text>
//      <Text style={styles.label}>Name</Text>
//      <TextInput
//        style={styles.input}
//        value={name}
//        onChangeText={setName}
//        placeholder="Enter your name"
//        placeholderTextColor="#aaa"
//      />
//      <Text style={styles.label}>Password</Text>
//      <TextInput
//        style={styles.input}
//        value={password}
//        onChangeText={setPassword}
//        placeholder="Enter your password"
//        placeholderTextColor="#aaa"
//        secureTextEntry
//      />
//      <TouchableOpacity style={styles.button} onPress={handleLogin}>
//        <Text style={styles.buttonText}>Login</Text>
//      </TouchableOpacity>
//    </View>
//  );
//}
//
//function MainScreen({ navigation }) {
//  return (
//    <View style={styles.container}>
//      <Text style={styles.header}>Main Page</Text>
//      <View style={styles.selector}>
//        <Text style={styles.label}>Select Patient:</Text>
//        <TextInput style={styles.input} placeholder="Enter patient name" placeholderTextColor="#aaa" />
//      </View>
//      <Image source={{ uri: 'https://www.example.com/ecg.png' }} style={styles.ecg} />
//      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPatient')}>
//        <Text style={styles.buttonText}>Add Patient</Text>
//      </TouchableOpacity>
//      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PatientChart')}>
//        <Text style={styles.buttonText}>Patient Chart</Text>
//      </TouchableOpacity>
//    </View>
//  );
//}
//
//function AddPatientScreen() {
//  return (
//    <View style={styles.container}>
//      <Text style={styles.header}>Add Patient</Text>
//      {/* Add your form components here */}
//    </View>
//  );
//}
//
//function PatientChartScreen() {
//  return (
//    <View style={styles.container}>
//      <Text style={styles.header}>Patient Chart</Text>
//      {/* Add your chart components here */}
//    </View>
//  );
//}
//
//export default function App() {
//  return (
//    <NavigationContainer>
//      <Stack.Navigator initialRouteName="Login">
//        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
//        <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ headerShown: false }} />
//        <Stack.Screen name="PatientChart" component={PatientChartScreen} options={{ headerShown: false }} />
//      </Stack.Navigator>
//    </NavigationContainer>
//  );
//}
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    backgroundColor: '#f5f5f5',
//    padding: 20,
//  },
//  logo: {
//    width: 100,
//    height: 100,
//    marginBottom: 20,
//  },
//  header: {
//    fontSize: 24,
//    fontWeight: 'bold',
//    marginBottom: 30,
//  },
//  label: {
//    fontSize: 18,
//    alignSelf: 'flex-start',
//    marginLeft: 10,
//    marginBottom: 5,
//  },
//  input: {
//    width: '100%',
//    height: 50,
//    borderColor: '#ccc',
//    borderWidth: 1,
//    marginBottom: 20,
//    paddingLeft: 15,
//    borderRadius: 5,
//    backgroundColor: '#fff',
//  },
//  button: {
//    width: '100%',
//    height: 50,
//    backgroundColor: '#007BFF',
//    justifyContent: 'center',
//    alignItems: 'center',
//    borderRadius: 5,
//    marginBottom: 10,
//  },
//  buttonText: {
//    fontSize: 18,
//    color: '#fff',
//    fontWeight: 'bold',
//  },
//  selector: {
//    width: '100%',
//    marginBottom: 20,
//  },
//  ecg: {
//    width: '100%',
//    height: 200,
//    marginBottom: 20,
//    backgroundColor: '#eee',
//  },
//});

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
