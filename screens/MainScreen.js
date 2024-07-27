import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

export default function MainScreen({ route, navigation }) {
  const { doctorId } = route.params; // Retrieve the doctor's ID from the route parameters
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Doctor ID in MainScreen:', doctorId);
    fetchPatients();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [])
  );

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.115:3000/patients');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        throw new Error('Response is not an array');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch patients');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Main Page</Text>
      <Picker
        selectedValue={selectedPatient}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedPatient(itemValue)}
      >
        <Picker.Item label="Select a patient" value="" />
        {patients.map((patient) => (
          <Picker.Item key={patient.id} label={`${patient.name} ${patient.surname}`} value={patient.id} />
        ))}
      </Picker>
      <Image
        source={{ uri: 'https://i1.wp.com/a-fib.com/wp-content/uploads/2012/08/Schematic-diagram-of-normal-sinus-rhythm-for-a-human-heart-as-seen-on-ECG-Wikipedia-free-to-use.png' }}
        style={styles.ecg}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPatient')}>
        <Text style={styles.buttonText}>Add Patient</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (selectedPatient) {
            navigation.navigate('PatientChart', {
              patientId: selectedPatient,
              doctorId: doctorId, // Pass the doctorId
            });
          } else {
            Alert.alert('Error', 'Please select a patient first');
          }
        }}
      >
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
    color: '#333',
  },
  picker: {
    width: '100%',
    color: '#007BFF', // Set text color for the picker items
    backgroundColor: 'transparent', // Transparent background
  },
  ecg: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#eee',
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
});
