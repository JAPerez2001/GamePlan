import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image, TextInput, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const sampleContacts = [
  { id: 'user0', name: 'Manuel Rodriguez', profilePictureUrl: 'https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg' },
  { id: 'user2', name: 'Jane Smith', profilePictureUrl: 'https://t3.ftcdn.net/jpg/01/85/04/84/360_F_185048418_X1kohHSgyAbPJQxPHurs4uXCTmcRSNAp.jpg' },
  { id: 'user3', name: 'Alice Johnson', profilePictureUrl: 'https://media.istockphoto.com/id/1008641434/photo/golden-sunset-over-hatchling-turtles-caretta-caretta.jpg?s=612x612&w=0&k=20&c=T5BfwYBwTa2t4ZHXkQ5cwf42QMIsm1ReaE5ae3XuUUc=' },
  { id: 'user4', name: 'Ahmed Al-Masri', profilePictureUrl: 'https://www.theglobeandmail.com/resizer/v2/MHHX2F6QMVE6BBIBT5S4R4VBRM.jpg?auth=630e6eab82190866aa7f991ab72ebd5fe71209338a5db97fb914c0cae2afbd85&width=1200&quality=80' },
  { id: 'user5', name: 'Igor Petrov', profilePictureUrl: 'https://i.guim.co.uk/img/media/e9fb03cd921de212161e0c8fadb8123962431b98/0_1468_3762_2256/master/3762.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=4b0513dac12c3ee4e42a978f7f2f70f4' },
  { id: 'user6', name: 'Sarah White', profilePictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
];

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editText}>{isEditing ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      ),
    });

    const unsubscribe = onSnapshot(collection(db, 'chats'), (snapshot) => {
      const chatList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [navigation, isEditing]);

  const toggleChatSelection = (chatId) => {
    if (isEditing) {
      setSelectedChats(prev =>
        prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
      );
    } else {
      navigation.navigate('Conversation', { name: chatId });
    }
  };

  const deleteSelectedChats = async () => {
    await Promise.all(selectedChats.map(chatId => deleteDoc(doc(db, 'chats', chatId))));
    setSelectedChats([]);
    setIsEditing(false);
  };

  const addChat = async (contact) => {
    try {
      const chatQuery = query(collection(db, 'chats'), where('name', '==', contact.name));
      const querySnapshot = await getDocs(chatQuery);

      if (!querySnapshot.empty) {
        Alert.alert('Chat Exists', 'A chat already exists with this contact.', [{ text: 'OK' }]);
        return;
      }

      await addDoc(collection(db, 'chats'), { name: contact.name, type: 'private', participants: [contact.id], profilePictureUrl: contact.profilePictureUrl });
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding chat: ', error);
      Alert.alert('Error', 'There was an error adding the chat. Please try again.');
    }
  };

  const filterChats = (chats, searchQuery) => chats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const data = [
    { title: 'Team Chats', data: filterChats(chats.filter(chat => chat.type === 'team'), searchQuery) },
    { title: 'Private Chats', data: filterChats(chats.filter(chat => chat.type === 'private'), searchQuery) },
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search chats"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionHeader}>{item.title}</Text>
            {item.data.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                onPress={() => toggleChatSelection(chat.id)}
                style={[styles.chatItem, selectedChats.includes(chat.id) && styles.chatItemSelected]}
              >
                <Image source={{ uri: chat.profilePictureUrl }} style={styles.profilePicture} />
                <Text style={styles.chatName}>{chat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
      />

      <TouchableOpacity
        style={[styles.fab, {backgroundColor: isEditing ? "#e91e63" : "#007bff"}]}
        onPress={isEditing ? deleteSelectedChats : () => setModalVisible(true)}
      >
        <MaterialCommunityIcons name={isEditing ? 'trash-can' : 'plus'} size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a New Chat from Contacts</Text>
            <FlatList
              data={sampleContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.contactItem} onPress={() => addChat(item)}>
                  <Image source={{ uri: item.profilePictureUrl }} style={styles.profilePicture} />
                  <Text style={styles.contactName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchInput: { height: 45, borderColor: '#888', borderWidth: 1, borderRadius: 25, paddingLeft: 15, marginBottom: 15, backgroundColor: '#e3e3e3' },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  chatItemSelected: { backgroundColor: '#cce5ff' },
  chatName: { fontSize: 18, marginLeft: 10 },
  profilePicture: { width: 40, height: 40, borderRadius: 20 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#333' },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007bff', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', margin: 20, borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  contactName: { fontSize: 16, marginLeft: 10 },
  closeButton: { alignSelf: 'center', backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 15, marginTop: 20 },
  closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold',  },
  editText: { fontSize: 18, color: '#007bff', marginRight: 15 },
});

export default ChatList;
