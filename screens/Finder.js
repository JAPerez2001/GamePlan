import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Finder = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For search query
  const [searchResults, setSearchResults] = useState([]); // To hold search results

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      // Set the region to the user's current location
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setLoading(false);
    };

    getLocation();
  }, []);

  // Function to handle search query
  const handleSearch = async (query) => {
    if (query === "") {
      setSearchResults([]); // If query is empty, clear results
      return;
    }

    // For simplicity, use reverse geocoding based on the current location
    const results = await findNearbyPlaces(query);

    setSearchResults(results); // Set the search results to state
  };

  // Example function that generates nearby places based on distance and current location
  const findNearbyPlaces = async (query) => {
    // Predefined places nearby. You can modify this list or get dynamic data from your backend.
    const predefinedPlaces = [
      { name: "Coffee Shop", latitude: 32.9857, longitude: -96.7502 },
      { name: "Restaurant", latitude: 32.9900, longitude: -96.7600 },
      { name: "Park", latitude: 32.9800, longitude: -96.7550 },
      { name: "Gym", latitude: 32.9880, longitude: -96.7530 },
    ];

    // Simulate a search based on the query and find places that match the query
    const filteredPlaces = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );

    // Optionally, you can add a filter to calculate distance to the current location here

    return filteredPlaces;
  };

  const handleSelectPlace = (place) => {
    // Update map region based on the selected place
    setRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    setSearchResults([]); // Clear search results after selection
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for places"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          handleSearch(text);
        }}
      />

      {/* Search results list */}
      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectPlace(result)}
            >
              <Text style={styles.resultItem}>{result.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Map View */}
      {region && (
        <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
            />
          )}
          {/* Render markers for search results */}
          {searchResults.map((result, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: result.latitude,
                longitude: result.longitude,
              }}
              title={result.name}
            />
          ))}
        </MapView>
      )}
    </View>
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
});

export default Finder;
