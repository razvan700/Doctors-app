import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Main Page</Text>
      <View style={styles.selector}>
        <Text style={styles.label}>Select Patient:</Text>
        <TextInput style={styles.input} placeholder="Enter patient name" placeholderTextColor="#aaa" />
      </View>
      <Image source={{ uri: 'https://www.example.com/ecg.png' }} style={styles.ecg} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPatient')}>
        <Text style={styles.buttonText}>Add Patient</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PatientChart')}>
        <Text style={styles.buttonText}>Patient Chart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  selector: {
    width: '100%',
    marginBottom: 20,
  },
  ecg: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
});
