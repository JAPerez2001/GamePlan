// /screens/Finder.js
import React, {useEffect, useState} from "react";
import {
    StyleSheet,
    View,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import * as Location from "expo-location";
import MapView, {Marker, Callout} from "react-native-maps";
import {useDebounce} from 'use-debounce';


const Finder = ({navigation}) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Hardcoded locations
    const predefinedPlaces = [
        {id: 1, name: "UTD Soccer Field 1", latitude: 32.9832, longitude: -96.7515},
        {id: 2, name: "UTD Soccer Field 2", latitude: 32.9832, longitude: -96.7525},
        {id: 3, name: "UTD Soccer Field 3", latitude: 32.9832, longitude: -96.7535},
        {id: 4, name: "UTD Soccer Field 4", latitude: 32.9820, longitude: -96.7518},
        {id: 5, name: "UTD Soccer Field 5", latitude: 32.9820, longitude: -96.7528},
        {id: 6, name: "UTD Tennis Courts", latitude: 32.9828, longitude: -96.7502},
    ];

    useEffect(() => {
        const getLocation = async () => {
            try {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setLoading(false);
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                setCurrentLocation(location.coords);
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        getLocation();
    }, []);

    useEffect(() => {
        if (debouncedSearchQuery !== "") {
            handleSearch(debouncedSearchQuery);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery]);

    const handleSearch = async (query) => {
        const results = predefinedPlaces.filter((place) =>
            place.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleSelectPlaceFromSearch = (place) => {
        setRegion({
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
        setSelectedPlace(place); // Update the selected place
        setSearchQuery("");  // Clears the search query
        setSearchResults([]);  // Clears the search results
    };

    const handleSelectPlaceFromMap = (place) => {
        setSelectedPlace(place); // Set the selected place details
        setShowDetails(true); // Show the details modal
    };

    const handleRegionChange = (newRegion) => {
        if (newRegion.latitude !== region.latitude || newRegion.longitude !== region.longitude) {
            setRegion(newRegion);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for places"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                {searchResults.length > 0 && (
                    <View style={styles.resultsContainer}>
                        {searchResults.map((result, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleSelectPlaceFromSearch(result)} // Select place from search
                            >
                                <Text style={styles.resultItem}>{result.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {region && (
                    <MapView
                        style={styles.map}
                        region={region}
                        onRegionChangeComplete={handleRegionChange}
                    >
                        {currentLocation && (
                            <Marker
                                coordinate={{
                                    latitude: currentLocation.latitude,
                                    longitude: currentLocation.longitude,
                                }}
                                title="Your Location"
                            />
                        )}
                        {predefinedPlaces.map((place) => (
                            <Marker
                                key={place.id}
                                coordinate={{
                                    latitude: place.latitude,
                                    longitude: place.longitude,
                                }}
                                title={place.name}
                                pinColor={selectedPlace && selectedPlace.id === place.id ? "blue" : "red"} // Highlight selected marker
                                onPress={() => handleSelectPlaceFromMap(place)}
                            >
                                {selectedPlace && selectedPlace.id === place.id && (
                                    <Callout>
                                        <Text>{place.name}</Text>
                                    </Callout>
                                )}
                            </Marker>
                        ))}
                    </MapView>
                )}

                {selectedPlace && showDetails && (
                    <Modal
                        visible={showDetails}
                        animationType="slide"
                        onRequestClose={() => setShowDetails(false)}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
                            <Text style={styles.modalDescription}>Booking Information:</Text>
                            <Text style={styles.modalDescription}>Availability: M W THU SUN</Text>
                            <Text style={styles.modalDescription}>Phone Number: +19728832111</Text>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Calendar', {
                                    location: selectedPlace.name,
                                    showCreateEventModal: true
                                })
                            }}>
                                <Text style={styles.closeButton}>Add Event</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDetails(false)}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    resultsContainer: {
        position: "absolute",
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
        maxHeight: 200,
        zIndex: 1,
    },
    resultItem: {
        padding: 10,
        fontSize: 16,
    },
    map: {
        flex: 1,
        width: "100%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    modalDescription: {
        fontSize: 16,
        marginVertical: 20,
    },
    closeButton: {
        fontSize: 18,
        color: "#e91e63",
        marginTop: 10,
    },
});

export default Finder;
