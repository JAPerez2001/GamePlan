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
                renderItem={(item, firstItemInDay) => (
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
                renderEmptyData={() => {
                    return <View>
                        <Text style={styles.emptyEventText}>No events today</Text>
                    </View>;
                }}
                loadItemsForMonth={month => {
                    console.log('trigger items loading');
                }}
                onCalendarToggeld={calendarOpened => {
                    console.log(calendarOpened);
                }}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add Event</Text>
                        <Text style={styles.modalLabel}>Event Name:</Text>
                        <TextInput
                            placeholder="Event Name"
                            value={newEvent.name}
                            onChangeText={(text) => setNewEvent({ ...newEvent, name: text })}
                            style={styles.input}
                        />

                        <Text style={styles.modalLabel}>Date:</Text>
                        <TouchableOpacity onPress={() => setShowDate(true)} style={styles.dateButton}>
                            <Text style={styles.dateText}>{selectedDate}</Text>
                        </TouchableOpacity>
                        {showDate && (
                            <DateTimePicker
                                value={new Date(selectedDate)}
                                mode={'date'}
                                onChange={(_, newDate) => {
                                    setSelectedDate(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`);
                                    setShowDate(false);
                                }}
                            />
                        )}

                        <Text style={styles.modalLabel}>Location (optional):</Text>
                        <TextInput
                            placeholder="Location (Optional)"
                            value={newEvent.data}
                            onChangeText={(text) => setNewEvent({ ...newEvent, data: text })}
                            style={styles.input}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={addEvent}>
                                <Text style={styles.buttonText}>Add Event</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        borderRadius: 10,
        padding: 15,
        marginRight: 10,
        marginTop: 20,
        paddingBottom: 20,
        elevation: 5,
    },
    itemText: {
        color: 'black',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        padding: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    dateButton: {
        marginBottom: 15,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#2196f3',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 10,
        flex: 1,
        alignItems: 'center',
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        marginRight: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#333',
    },
    emptyEventText: {
        fontSize: 20,
        color: 'gray',
        justifyContent: 'center',
        padding: 120,
        paddingTop: 150,
    }
});

export default Calendar;