import React, { useEffect, useState } from "react";
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
  Image,
  ScrollView, 
} from "react-native";
import * as Location from "expo-location";
import { useDebounce } from "use-debounce";

const Finder = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]); 
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showDetails, setShowDetails] = useState(false);


  const predefinedPlaces = [
    {
      id: 1,
      name: "UTD Soccer Field 1",
      latitude: 32.9832,
      longitude: -96.7515,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
    },
    {
      id: 2,
      name: "UTD Soccer Field 2",
      latitude: 32.9832,
      longitude: -96.7525,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
    },
    {
      id: 3,
      name: "UTD Soccer Field 3",
      latitude: 32.9832,
      longitude: -96.7535,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
    },
    {
      id: 4,
      name: "UTD Soccer Field 4",
      latitude: 32.9820,
      longitude: -96.7518,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
    },
    {
      id: 5,
      name: "UTD Soccer Field 5",
      latitude: 32.9820,
      longitude: -96.7528,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
    },
    {
      id: 6,
      name: "UTD Tennis Courts",
      latitude: 32.9828,
      longitude: -96.7502,
      imageUrl: "https://images.sidearmdev.com/convert?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fcometsports.utdallas.edu%2fimages%2f2020%2f6%2f2%2fDSC00589.jpg&type=webp",
      description: "2400 Armstrong Dr, Richardson, TX 75080",
    },
    {
        id: 7,
        name: "UTD Baseball Field",
        latitude: 32.981777801291784,
        longitude: -96.74888962464104,
        imageUrl: "https://lh5.googleusercontent.com/p/AF1QipPYbcmT4BLRs19coaVNkbhnNgoSEwUP8PmlYrp4=w408-h246-k-no",
        description: "2015-2313 University Pkwy, Richardson, TX 75080",
      },
      {
        id: 8,
        name: "Cricket Grounds",
        latitude: 32.97985181948951,
        longitude:  -96.74949043945766,
        imageUrl: "https://lh5.googleusercontent.com/p/AF1QipOMbkw2psPgSSp67EQaO04RpsDaOGAF2uWKv-2t=w408-h306-k-no",
        description: "Richardson, TX 75080",
      },
      {
        id: 9,
        name: "UTD Basketball Courts",
        latitude: 32.983667203179714,
        longitude: -96.74958720117691,
        imageUrl: "https://lh5.googleusercontent.com/p/AF1QipOpDK-boxOQOtEZIUowhAUST0Emxqjua0HhmOtn=w408-h544-k-no",
        description: "University of Texas at Dallas, Richardson, TX 75080",
      },
      {
        id: 10,
        name: "Edgington Basketball Court",
        latitude: 32.991364921239835,
        longitude: -96.75244241956948,
        imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=Owh6vvRR3sFo8Mc3Lmn0BQ&cb_client=search.gws-prod.gps&w=408&h=240&yaw=80.01974&pitch=0&thumbfov=100",
        description: "Residence Hall North West, 950 N Loop Rd, Richardson, TX 75080",
      },
      {
        id: 11,
        name: "National Cricket League Stadium", 
        latitude: 32.9808507962534, 
        longitude: -96.74976788467279,
        imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=HPT5i_KeumnBKnpFTOWy6w&cb_client=search.gws-prod.gps&w=408&h=240&yaw=87.441795&pitch=0&thumbfov=100",
        description: "Residence Hall North West, 950 N Loop Rd, Richardson, TX 75080",
      },
  ];

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
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


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedPlace(null); 
      setShowDetails(false); 
    });

    return unsubscribe;
  }, [navigation]);

  const handleSearch = (query) => {
    const results = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectPlaceFromList = (place) => {
    setSelectedPlace(place);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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

        {/* Make the list scrollable */}
        <ScrollView style={styles.resultsContainer}>
          {/* Show search results if query is provided */}
          {debouncedSearchQuery && searchResults.length > 0 && (
            <View>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectPlaceFromList(result)} 
                  style={styles.resultItemContainer}
                >
                  <Image
                    source={{ uri: result.imageUrl }}
                    style={styles.resultImage}
                  />
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultName}>{result.name}</Text>
                    <Text style={styles.resultDescription}>{result.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Show message if no results found */}
          {debouncedSearchQuery && searchResults.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}
        </ScrollView>

        {/* Details modal */}
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Calendar", {
                    location: selectedPlace.name,
                    showCreateEventModal: true,
                  });
                }}
              >
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
    paddingTop: 20,
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
    paddingHorizontal: 20,
    marginTop: 20,
    flex: 1, 
  },
  resultItemContainer: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    alignItems: "center",
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resultDescription: {
    fontSize: 14,
    color: "#555",
  },
  noResultsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
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
