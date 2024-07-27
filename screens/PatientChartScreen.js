import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function PatientChartScreen({ route, navigation }) {
  const { patientId, doctorId } = route.params || {};
  const [patient, setPatient] = useState({});
  const [observations, setObservations] = useState([]);
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    console.log('Patient ID from route:', patientId);
    console.log('Doctor ID from route:', doctorId);

    if (patientId) {
      fetchPatientData();
      fetchObservations();
    }
  }, [patientId, doctorId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching patient data for ID: ${patientId}`);
      const response = await fetch(`http://192.168.0.115:3000/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Patient data:', data);
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      Alert.alert('Error', 'Could not fetch patient data');
    } finally {
      setLoading(false);
    }
  };

  const fetchObservations = async () => {
    try {
      setLoading(true);
      console.log(`Fetching observations for patient ID: ${patientId}`);
      const response = await fetch(`http://192.168.0.115:3000/observations/${patientId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Observations:', data);
      setObservations(data);
    } catch (error) {
      console.error('Error fetching observations:', error);
      Alert.alert('Error', 'Could not fetch observations');
    } finally {
      setLoading(false);
    }
  };

  const handleObservationSubmit = async () => {
    try {
      setLoading(true);
      console.log('Submitting observation:', observation);
      console.log('Doctor ID:', doctorId);  // Log the doctorId to verify it's correct
      console.log('Patient ID:', patientId);

      if (!doctorId) {
        throw new Error('doctorId is undefined');
      }

      const payload = {
        doctor_id: doctorId,
        patient_id: patientId,
        observation,
        date: new Date().toISOString(),
      };
      console.log('Payload:', payload);

      const response = await fetch('http://192.168.0.115:3000/add-observation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Error response:', error);
        throw new Error(`Failed to add observation: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      Alert.alert('Success', 'Observation added successfully');
      setObservation('');
      fetchObservations();  // Refresh the list of observations
    } catch (error) {
      console.error('Error adding observation:', error);
      Alert.alert('Error', `Could not add observation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setIsRecording(false);
    sendToServer(uri);
  };

const sendToServer = async (uri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/m4a',
      name: 'speech.m4a',
    });

    const response = await fetch('http://192.168.0.115:3000/convert', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('Wit.ai response:', result);

    // Extract the text from the parsed response
    const transcriptions = result.map(item => item.text).filter(text => text);
    if (transcriptions.length > 0) {
      // Join and remove duplicate consecutive words
      const combinedText = transcriptions.join(' ');
      const uniqueWords = combinedText.split(' ').filter((item, pos, self) => self.indexOf(item) === pos);
      const finalText = uniqueWords.join(' ');

      setObservation(finalText);
    } else {
      Alert.alert('Error', 'Could not transcribe the audio');
    }
  } catch (error) {
    console.error('Error sending audio to server', error);
    Alert.alert('Error', 'Could not transcribe the audio');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Patient Chart</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        patientId ? (
          <>
            <Text style={styles.subHeader}>Patient Details</Text>
            <Text style={styles.infoText}>Name: {patient.name} {patient.surname}</Text>
            <Text style={styles.infoText}>Age: {patient.age}</Text>
            <Text style={styles.infoText}>Birth Date: {patient.birth_date}</Text>
            <Text style={styles.subHeader}>Observations</Text>
            {observations.length > 0 ? (
              observations.map((obs) => (
                <View key={obs.id_notes} style={styles.observation}>
                  <Text style={styles.observationText}>{obs.observation}</Text>
                  <Text style={styles.observationDate}>{new Date(obs.created_at).toLocaleDateString()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>No observations found</Text>
            )}
            <TextInput
              style={styles.input}
              value={observation}
              onChangeText={setObservation}
              placeholder="Enter observation"
            />
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Voice Recognition'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleObservationSubmit}>
              <Text style={styles.buttonText}>Add Observation</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.errorText}>No patient selected</Text>
        )
      )}
    </ScrollView>
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
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
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
  voiceButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  observation: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  observationText: {
    fontSize: 16,
  },
  observationDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
