// /screens/Settings.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Settings = () => {
  const [displayName, setDisplayName] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('online');
  const [isSetting1Enabled, setIsSetting1Enabled] = useState(true);

  const getStatusColor = () => {
    switch (onlineStatus) {
      case 'online':
        return 'green';
      case 'away':
        return 'orange';
      case 'offline':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <View style={styles.container}>

      {/* Display Name */}
      <View style={styles.settingItem}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter display name"
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>

      {/* Online Status */}
      <View style={styles.settingItem}>
        <Text style={styles.label}>Online Status</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Picker
            selectedValue={onlineStatus}
            style={styles.picker}
            onValueChange={(itemValue) => setOnlineStatus(itemValue)}
          >
            <Picker.Item label="Online" value="online" />
            <Picker.Item label="Offline" value="offline" />
            <Picker.Item label="Away" value="away" />
          </Picker>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.settingItem}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Toggle Options */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Enable Notifications</Text>
        <Switch
          value={isSetting1Enabled}
          onValueChange={setIsSetting1Enabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  settingItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  picker: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default Settings;