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
import { useDebounce } from 'use-debounce'; // Added debounce hook

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Finder = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Add debounced search
  const [searchResults, setSearchResults] = useState([]);

  // Hardcoded practice locations
  const predefinedPlaces = [
    { name: "UTD Soccer Field 1", latitude: 32.9832, longitude: -96.7515 },
    { name: "UTD Soccer Field 2", latitude: 32.9832, longitude: -96.7525 },
    { name: "UTD Soccer Field 3", latitude: 32.9832, longitude: -96.7535 },
    { name: "UTD Soccer Field 4", latitude: 32.9820, longitude: -96.7518 },
    { name: "UTD Soccer Field 5", latitude: 32.9820, longitude: -96.7528 },
    { name: "UTD Tennis Courts", latitude: 32.9828, longitude: -96.7502 },
  ];

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

  useEffect(() => {
    if (debouncedSearchQuery !== "") {
      handleSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]); // Clear search results if query is empty
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async (query) => {
    const results = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectPlace = (place) => {
    setRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    setSearchResults([]);
  };

  const handleRegionChange = (newRegion) => {
    if (newRegion.latitude !== region.latitude || newRegion.longitude !== region.longitude) {
      setRegion(newRegion);
    }
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
              onPress={() => handleSelectPlace(result)}
            >
              <Text style={styles.resultItem}>{result.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {region && (
        <MapView style={styles.map} region={region} onRegionChangeComplete={handleRegionChange}>
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
            />
          )}
          {predefinedPlaces.map((result, index) => (
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
