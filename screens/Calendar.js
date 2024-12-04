import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

function Calendar({ route, navigation }) {
    const { showCreateEventModal, location } = route.params || {};
    const [items, setItems] = useState({
        '2024-11-9': [{ name: 'Practice', data: '@UTD campus' }],
        '2024-11-10': [{ name: 'Tournament', data: '@UTD campus' }]
    });

    const [modalVisible, setModalVisible] = useState(!!showCreateEventModal);
    const [newEvent, setNewEvent] = useState({ name: '', data: location ?? '' });
    const newDate = new Date();
    const [selectedDate, setSelectedDate] = useState(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`);
    const [showDate, setShowDate] = useState(false);

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
            setNewEvent({ name: '', data: '' });
            setModalVisible(false);
        }
    };

    const renderEmptyData = (date) => {
        return (
            <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'grey' }}>{date ? date.day : ''}</Text>
            </View>
        );
    };

    useEffect(() => {
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
                    setSelectedDate(day.dateString);
                    const newItems = { ...items };
                    setItems(newItems);
                }}
                renderEmptyData={(date) => (
                    <Text style={styles.emptyEventText}>No event today</Text>
                )}
            />

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={{ textAlign: 'center', fontSize: 24, padding: 10 }}>Add Event</Text>
                    <Text>Event Name:</Text>
                    <TextInput
                        placeholder="Event Name"
                        value={newEvent.name}
                        onChangeText={(text) => setNewEvent({ ...newEvent, name: text })}
                        style={styles.input}
                    />

                    <Text style={{ marginBottom: 5 }}>Date:</Text>
                    <Text style={{ marginBottom: 10, color: '#2196f3' }} onPress={() => setShowDate(true)}>{selectedDate.toString()}</Text>
                    {
                        showDate &&
                        <DateTimePicker
                            value={new Date(selectedDate)}
                            mode={'date'}
                            onChange={(_, newDate) => {
                                setSelectedDate(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`);
                                setShowDate(false);
                            }}
                        />
                    }

                    <Text>Location (optional):</Text>
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
    emptyEventText: {
        fontSize: 20,
        color: 'gray',
        justifyContent: 'center',
        padding: 130,
    }
});

export default Calendar;
