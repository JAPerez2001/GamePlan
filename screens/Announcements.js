// /screens/Profile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Announcements = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Management Coming Soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Announcements;