import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image, TextInput } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const ChatList = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 

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

  const teamChats = chats.filter(chat => chat.type === 'team');
  const privateChats = chats.filter(chat => chat.type === 'private');

  const filteredTeamChats = teamChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPrivateChats = privateChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const data = [
    { title: 'Team', data: filteredTeamChats },
    { title: 'Private Chats', data: filteredPrivateChats },
  ];

  return (
    <View style={styles.container}>
      {/* Search input field */}
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
            {item.data.map(chat => (
              <TouchableOpacity
                key={chat.id}
                onPress={() => navigation.navigate('Conversation', { name: chat.id })}
                style={styles.chatItem}
              >
                {/* Profile picture */}
                {chat.profilePictureUrl ? (
                  <Image
                    source={{ uri: chat.profilePictureUrl }}
                    style={styles.profilePicture}
                  />
                ) : (
                  <View style={styles.profilePlaceholder} />
                )}

                <Text style={styles.chatName}>{chat.name || chat.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 45, 
    borderColor: '#888',  
    borderWidth: 1,
    borderRadius: 25, 
    paddingLeft: 15,
    marginBottom: 15, 
    backgroundColor: '#e3e3e3',  
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
    marginLeft: 10, 
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
    backgroundColor: '#ccc',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
});

export default ChatList;