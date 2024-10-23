import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatList from '../screens/ChatList';
import Conversation from '../screens/Conversation';

const ChatStack = createStackNavigator();

function ChatStackScreen({ navigation }) {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatList"
        component={ChatList}
        options={{
          title: 'Chats',  // Set the title for the screen
          headerRight: () => (
            <MaterialCommunityIcons
              name="plus"
              size={24}
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('ChatList', { showModal: true })}  // Trigger modal when pressed
            />
          ),
        }}
      />
      <ChatStack.Screen 
        name="Conversation" 
        component={Conversation} 
        options={({ route }) => ({ title: route.params.name })} 
      />
    </ChatStack.Navigator>
  );
}

export default ChatStackScreen;