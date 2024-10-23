import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native'; // Make sure Modal, TextInput, and TouchableOpacity are imported
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

function Chat() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat!</Text>
    </View>
  );
}

function Finder() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Field Finder!</Text>
    </View>
  );
}

function Calendar({ navigation }) {
  const [items, setItems] = React.useState({
    '2024-10-22': [{ name: 'Practice', data: '@UTD campus' }],
    '2024-10-26': [{ name: 'Tournament', data: '@UTD campus' }]
  });
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({ name: '', data: '' });
  const [selectedDate, setSelectedDate] = React.useState('');

  const addEvent = () => {
    if (newEvent.name && selectedDate) {
      const newItems = {
        ...items,
        [selectedDate]: [...(items[selectedDate] || []), { 
          name: newEvent.name, 
          data: newEvent.data || ' ' 
        }]
      };
      setItems(newItems);
      setNewEvent({ name: '', data: '' }); // reset form
      setModalVisible(false);
    }
  };

  // Set header right button
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 20 }}>
          <Text style={{ fontSize: 30 }}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={items}
        renderItem={(item) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.data}</Text>
          </TouchableOpacity>
        )}
        onDayPress={(day) => {
          setSelectedDate(day.dateString); // Capture the currently selected date
          const newItems = {...items};
          setItems(newItems);
        }}
      />
      
      {/* Modal for adding new events */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Event Name"
            value={newEvent.name}
            onChangeText={(text) => setNewEvent({ ...newEvent, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Location (Optional)"
            value={newEvent.data}
            onChangeText={(text) => setNewEvent({ ...newEvent, data: text })}
            style={styles.input}
          />
          <Button title="Add Event" onPress={addEvent} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'lightblue',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 20,
  },
  itemText: {
    color: 'black',
    fontSize: 14,
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

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Locations"
        component={Finder}
        options={{
          tabBarLabel: 'Finder',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}