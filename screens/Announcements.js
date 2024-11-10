import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sampleAnnouncements = [
  { id: 1, title: "Practice Canceled", description: "Today's practice is canceled due to weather.", postedTime: "10:00 AM" },
  { id: 2, title: "Game Rescheduled", description: "The game has been rescheduled to next Friday.", postedTime: "9:30 AM" },
];

function Announcements() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');  
  const [newDescription, setNewDescription] = useState('');
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={28} color="#e91e63" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleAddAnnouncement = () => {
    if (newTitle && newDescription) {
      const newAnnouncement = {
        id: announcements.length + 1,
        title: newTitle,
        description: newDescription,
        postedTime: new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }),
      };

      setAnnouncements([...announcements, newAnnouncement]);
      setNewTitle('');
      setNewDescription('');
      setModalVisible(false);
    } else {
      Alert.alert("Missing Fields", "Please fill in both the title and description.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        {announcements.map((announcement) => (
          <View key={announcement.id} style={styles.bubbleBox}>
            <Text style={styles.title}>{announcement.title}</Text>
            <Text style={styles.description}>{announcement.description}</Text>
            <Text style={styles.time}>{announcement.postedTime}</Text>
          </View>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text>Title:</Text>
          <TextInput
            placeholder="Title"
            value={newTitle}
            onChangeText={setNewTitle}
            style={styles.input}
          />
          <Text>Description:</Text>
          <TextInput
            placeholder="Description"
            value={newDescription}
            onChangeText={setNewDescription}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleAddAnnouncement}
            style={styles.checkButton}
          >
            <MaterialCommunityIcons
              name="check"
              size={30}
              color="green"
            />
          </TouchableOpacity>
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  checkButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  bubbleContainer: {
    width: '90%',
    padding: 10,
  },
  bubbleBox: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  time: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default Announcements;