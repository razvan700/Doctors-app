import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddPatientScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Patient</Text>
      {/* Add your form components here */}
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
});
