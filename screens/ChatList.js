import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const ChatList = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'chats'), (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (route.params?.showModal) {
      setModalVisible(true);
      navigation.setParams({ showModal: false });
    }
  }, [navigation, route.params]);

  const createChat = async () => {
    if (newChatName.trim()) {
      try {
        await addDoc(collection(db, 'chats'), {
          name: newChatName,
          profilePictureUrl: '', // You can update this field with a default or user-uploaded image URL
        });
        setNewChatName('');
        setModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to create chat: ' + error.message);
      }
    } else {
      Alert.alert('Error', 'Please enter a chat name');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Conversation', { name: item.id })}
            style={styles.chatItem}
          >
            {/* Profile picture */}
            {item.profilePictureUrl ? (
              <Image
                source={{ uri: item.profilePictureUrl }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePlaceholder} />
            )}

            <Text style={styles.chatName}>{item.name || item.id}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for creating a new chat */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter new chat name"
              value={newChatName}
              onChangeText={setNewChatName}
            />
            <Button title="Create Chat" onPress={createChat} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatName: {
    fontSize: 18,
    marginLeft: 10,  // Add margin to separate the name from the image
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',  // Placeholder color
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
    justifyContent: 'center',  // Center the modal vertically
    alignItems: 'center',      // Center the modal horizontally
  },
  modalView: {
    width: '80%',  // Adjust the width as needed
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',  // Make input field take full width of modal
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ChatList;