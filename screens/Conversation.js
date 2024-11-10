import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, Button, StyleSheet, Image } from 'react-native';
import { collection, doc, getDoc, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function Conversation({ route, navigation }) {
  const { name } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatDetails, setChatDetails] = useState(null);

  // Hardcoded senderId for simplicity
  const senderId = "user1";  // Change this as needed to simulate different users

  useEffect(() => {
    const q = query(collection(db, 'chats', name, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((doc) => {
        loadedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(loadedMessages); // Firebase handles message order
    });

    return () => unsubscribe();
  }, [name]);

  // Fetch chat details (including profile picture) when the component loads
  useEffect(() => {
    const fetchChatDetails = async () => {
      const chatDoc = doc(db, 'chats', name);
      const chatSnapshot = await getDoc(chatDoc);
      if (chatSnapshot.exists()) {
        setChatDetails(chatSnapshot.data()); // Store chat details (including profile picture)
      }
    };

    fetchChatDetails();
  }, [name]);

  // Set the header options (title and profile picture)
  useEffect(() => {
    if (chatDetails) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Image
              source={{ uri: chatDetails.profilePictureUrl }} // Profile picture URL
              style={styles.profilePicture}
            />
            <Text style={styles.chatTitle}>{chatDetails.name || name}</Text>
          </View>
        ),
      });
    }
  }, [chatDetails, navigation, name]);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, 'chats', name, 'messages'), {
        text: message,
        senderId: senderId,
        timestamp: new Date(),
      });
      setMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = timestamp.toDate();
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString();
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groupedMessages = [];
    let lastDate = '';
    messages.forEach((message) => {
      const messageDate = message.timestamp.toDate().toDateString();
      if (messageDate !== lastDate) {
        groupedMessages.push({ type: 'date', date: message.timestamp });
        lastDate = messageDate;
      }
      groupedMessages.push({ type: 'message', ...message });
    });
    return groupedMessages;
  };

  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatTimestamp(item.date)}</Text>
        </View>
      );
    }

    const isMyMessage = item.senderId === senderId;

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, isMyMessage ? styles.myTimestamp : styles.otherTimestamp]}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
    );
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <View style={styles.container}>
      {/* Message List */}
      <FlatList
        data={groupedMessages}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        scrollEventThrottle={16}
      />
      
      {/* Input for Sending Messages */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  chatContainer: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '70%',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#e91e63',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  timestamp: {
    fontSize: 10,
    color: '#555',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  myTimestamp: {
    color: 'white',
  },
  otherTimestamp: {
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
  },
});

export default Conversation;