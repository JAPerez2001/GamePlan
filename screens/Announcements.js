import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sampleAnnouncements = [
  {
    id: 1,
    title: "Practice Canceled",
    description: "Today's practice is canceled due to weather.",
    postedTime: "10:00 AM",
    date: "2024-12-03",
  },
  {
    id: 2,
    title: "Game Rescheduled",
    description: "The game has been rescheduled to next Friday.",
    postedTime: "9:30 AM",
    date: "2024-12-01",
  },
];

function Announcements() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);
  const [editMode, setEditMode] = useState(false);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setEditMode(prev => !prev)}>
          <Text style={styles.editButton}>{editMode ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, editMode]);

  const handleAddAnnouncement = () => {
    if (newTitle && newDescription) {
      const newAnnouncement = {

        id: announcements.length + 1,
        title: newTitle,
        description: newDescription,
        postedTime: new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }),
        date: new Date().toISOString().split('T')[0],
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setNewTitle('');
      setNewDescription('');
      setModalVisible(false);
    } else {
      Alert.alert("Missing Fields", "Please fill in both the title and description.");
    }
  };

  const handleSelectAnnouncement = (id) => {
    setSelectedAnnouncements(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleDeleteAnnouncements = () => {
    setAnnouncements(announcements.filter(announcement => !selectedAnnouncements.includes(announcement.id)));
    setSelectedAnnouncements([]);
    setEditMode(false);
  };

  const isPastDate = (date) => {
    return new Date(date) < new Date(new Date().setDate(new Date().getDate() - 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        {announcements.map((announcement) => (
          <TouchableOpacity
            key={announcement.id}
            style={[
              styles.bubbleBox,
              editMode && styles.editModeBubbleBox,
              editMode && selectedAnnouncements.includes(announcement.id) && styles.selectedBubbleBox,
              isPastDate(announcement.date) && styles.dimmedBubbleBox,
            ]}
            onPress={() => editMode && handleSelectAnnouncement(announcement.id)}
          >
            <Text style={[styles.title, isPastDate(announcement.date) && styles.dimmedText]}>
              {announcement.title}
            </Text>
            <Text style={[styles.description, isPastDate(announcement.date) && styles.dimmedText]}>
              {announcement.description}
            </Text>
            <Text style={[styles.time, isPastDate(announcement.date) && styles.dimmedText]}>
              {announcement.postedTime}
            </Text>
            <Text style={[styles.date, isPastDate(announcement.date) && styles.dimmedText]}>
              {announcement.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.fab, {backgroundColor: editMode ? "#e91e63" : "#007bff"}]}
        onPress={editMode ? handleDeleteAnnouncements : () => setModalVisible(true)}
      >
        <MaterialCommunityIcons
          name={editMode ? "trash-can-outline" : "plus"}
          size={28}
          color="white"
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.popupContainer}>
            <Text style={styles.modalTitle}>Add Announcement</Text>
            <TextInput
              placeholder="Title (Ex: Match tomorrow!)"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description (Meeting place, time, date, etc.)"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              style={[styles.input, styles.descriptionInput]} // Keep description input style
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleAddAnnouncement} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  bubbleContainer: { width: '90%', padding: 10 },
  bubbleBox: {
    backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5
  },
  selectedBubbleBox: { backgroundColor: '#f8d7da', borderWidth: 2, borderColor: '#f5c6cb' },
  editModeBubbleBox: { borderWidth: 2, borderColor: '#007bff' },
  dimmedBubbleBox: { backgroundColor: '#e0e0e0' },
  dimmedText: { color: '#888' },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#666', marginVertical: 5 },
  time: { fontSize: 12, color: '#aaa', textAlign: 'right' },
  date: { fontSize: 12, color: '#bbb', textAlign: 'right', fontWeight: 'bold' },
  fab: {
    position: 'absolute', bottom: 20, right: 20, backgroundColor: '#e91e63', width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center', elevation: 5
  },
  editButton: { fontSize: 18, color: '#007bff', marginRight: 15 },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  popupContainer: {
    width: '80%', backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10
  },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  descriptionInput: { height: 240, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  addButton: {
    backgroundColor: '#007bff', padding: 10, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center'
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#ccc', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: 'center'
  },
  cancelButtonText: { color: '#333', fontWeight: 'bold' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});

export default Announcements;
