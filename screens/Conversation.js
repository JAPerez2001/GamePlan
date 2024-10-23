// /screens/Conversation.js
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, Button } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function Conversation({ route }) {
  const { name } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'chats', name, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((doc) => {
        loadedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [name]);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, 'chats', name, 'messages'), {
        text: message,
        timestamp: new Date(),
      });
      setMessage('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 }}>
            <Text>{item.text}</Text>
            <Text style={{ fontSize: 10, color: '#555' }}>{item.timestamp?.toDate().toLocaleString()}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 }}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

export default Conversation;