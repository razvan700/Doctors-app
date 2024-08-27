import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back icon

export default function AddPatientScreen({ navigation }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');

  const handleAddPatient = async () => {
    try {
      const response = await fetch('http://192.168.101.27:3000/add-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, age, birthDate, address }),
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.status === 200) {
        Alert.alert('Patient Added Successfully', result.message, [
          { text: 'OK', onPress: () => navigation.goBack() } // Use goBack() to return to the previous screen
        ]);
      } else {
        Alert.alert('Add Patient Failed', result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Add Patient</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter patient's name"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Surname</Text>
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
        placeholder="Enter patient's surname"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter patient's age"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Birth Date</Text>
      <TextInput
        style={styles.input}
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder="Enter patient's birth date"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter patient's address"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
        <Text style={styles.buttonText}>Add Patient</Text>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 18,
    color: '#000',
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
});
