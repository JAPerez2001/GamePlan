import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, ActivityIndicator, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, Keyboard, Image, ScrollView } from "react-native";
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
  const [utdPlaces, setUtdPlaces] = useState([]);
  const [baseballPlaces, setBaseballPlaces] = useState([]);
  const [soccerPlaces, setSoccerPlaces] = useState([]);
  const [cricketPlaces, setCricketPlaces] = useState([]);
  const [basketballPlaces, setBasketballPlaces] = useState([]);
  const [showUtdPlaces, setShowUtdPlaces] = useState(false);
  const [showBaseballPlaces, setShowBaseballPlaces] = useState(false);
  const [showSoccerPlaces, setShowSoccerPlaces] = useState(false);
  const [showCricketPlaces, setShowCricketPlaces] = useState(false);
  const [showBasketballPlaces, setShowBasketballPlaces] = useState(false);


  const handleShowUtdPlaces = () => {
    const filteredPlaces = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes("utd")
    );
    setUtdPlaces(filteredPlaces);
    setShowUtdPlaces(true);
    setShowBaseballPlaces(false);
    setShowSoccerPlaces(false);
    setShowCricketPlaces(false);
    setShowBasketballPlaces(false);
  };

  const handleShowBaseballPlaces = () => {
    const filteredPlaces = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes("baseball")
    );
    setBaseballPlaces(filteredPlaces);
    setShowBaseballPlaces(true);
    setShowUtdPlaces(false);
    setShowSoccerPlaces(false);
    setShowCricketPlaces(false);
    setShowBasketballPlaces(false);
  };

  const handleShowSoccerPlaces = () => {
    const filteredPlaces = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes("soccer")
    );
    setSoccerPlaces(filteredPlaces);
    setShowSoccerPlaces(true);
    setShowUtdPlaces(false);
    setShowBaseballPlaces(false);
    setShowCricketPlaces(false);
    setShowBasketballPlaces(false);
  };

  const handleShowCricketPlaces = () => {
    const filteredPlaces = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes("cricket")
    );
    setCricketPlaces(filteredPlaces);
    setShowCricketPlaces(true);
    setShowUtdPlaces(false);
    setShowBaseballPlaces(false);
    setShowSoccerPlaces(false);
    setShowBasketballPlaces(false);
  };

  const handleShowBasketballPlaces = () => {
    const filteredPlaces = predefinedPlaces.filter((place) =>
      place.name.toLowerCase().includes("basketball")
    );
    setBasketballPlaces(filteredPlaces);
    setShowBasketballPlaces(true);
    setShowUtdPlaces(false);
    setShowBaseballPlaces(false);
    setShowSoccerPlaces(false);
    setShowCricketPlaces(false);
  };

  const clearSearchResults = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowUtdPlaces(false);
    setShowBaseballPlaces(false);
    setShowSoccerPlaces(false);
    setShowCricketPlaces(false);
    setShowBasketballPlaces(false);
  };


  const predefinedPlaces = [
    {
      id: 1,
      name: "UTD Soccer Field 1",
      latitude: 32.9832,
      longitude: -96.7515,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
      sportType: "Soccer",
    },
    {
      id: 2,
      name: "UTD Soccer Field 2",
      latitude: 32.9832,
      longitude: -96.7525,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
      sportType: "Soccer",
    },
    {
      id: 3,
      name: "UTD Soccer Field 3",
      latitude: 32.9832,
      longitude: -96.7535,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
      sportType: "Soccer",
    },
    {
      id: 4,
      name: "UTD Soccer Field 4",
      latitude: 32.9820,
      longitude: -96.7518,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
      sportType: "Soccer",
    },
    {
      id: 5,
      name: "UTD Soccer Field 5",
      latitude: 32.9820,
      longitude: -96.7528,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMzam8fV0wwxUCfc5iW8MDJVXuzh3rSmQyoq8-7=w408-h544-k-no",
      description: "800 W Campbell Rd, Richardson, TX 75080",
      sportType: "Soccer",
    },
    {
      id: 6,
      name: "UTD Tennis Courts",
      latitude: 32.9828,
      longitude: -96.7502,
      imageUrl: "https://images.sidearmdev.com/convert?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fcometsports.utdallas.edu%2fimages%2f2020%2f6%2f2%2fDSC00589.jpg&type=webp",
      description: "2400 Armstrong Dr, Richardson, TX 75080",
      sportType: "Tennis",
    },
    {
      id: 7,
      name: "UTD Baseball Field",
      latitude: 32.981777801291784,
      longitude: -96.74888962464104,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipPYbcmT4BLRs19coaVNkbhnNgoSEwUP8PmlYrp4=w408-h246-k-no",
      description: "2015-2313 University Pkwy, Richardson, TX 75080",
      sportType: "Baseball",
    },
    {
      id: 8,
      name: "Cricket Grounds",
      latitude: 32.97985181948951,
      longitude: -96.74949043945766,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipOMbkw2psPgSSp67EQaO04RpsDaOGAF2uWKv-2t=w408-h306-k-no",
      description: "Richardson, TX 75080",
      sportType: "Cricket",
    },
    {
      id: 9,
      name: "UTD Basketball Courts",
      latitude: 32.983667203179714,
      longitude: -96.74958720117691,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipOpDK-boxOQOtEZIUowhAUST0Emxqjua0HhmOtn=w408-h544-k-no",
      description: "University of Texas at Dallas, Richardson, TX 75080",
      sportType: "Basketball",
    },
    {
      id: 10,
      name: "Edgington Basketball Court",
      latitude: 32.991364921239835,
      longitude: -96.75244241956948,
      imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=Owh6vvRR3sFo8Mc3Lmn0BQ&cb_client=search.gws-prod.gps&w=408&h=240&yaw=80.01974&pitch=0&thumbfov=100",
      description: "Residence Hall North West, 950 N Loop Rd, Richardson, TX 75080",
      sportType: "Basketball",
    },
    {
      id: 11,
      name: "National Cricket League Stadium",
      latitude: 32.9808507962534,
      longitude: -96.74976788467279,
      imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=HPT5i_KeumnBKnpFTOWy6w&cb_client=search.gws-prod.gps&w=408&h=240&yaw=87.441795&pitch=0&thumbfov=100",
      description: "Residence Hall North West, 950 N Loop Rd, Richardson, TX 75080",
      sportType: "Cricket",
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
      } catch {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery !== "") {
      setSearchResults(predefinedPlaces.filter((place) =>
        place.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      ));
    } else {
      setSearchResults([]);
      setShowUtdPlaces(false);
      setShowBaseballPlaces(false);
      setShowSoccerPlaces(false);
      setShowCricketPlaces(false);
      setShowBasketballPlaces(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedPlace(null);
      setShowDetails(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleSelectPlaceFromList = (place) => {
    setSelectedPlace(place);
    setShowDetails(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={clearSearchResults} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {!showUtdPlaces && !showBaseballPlaces && !showSoccerPlaces && !showCricketPlaces && !showBasketballPlaces && !searchQuery && (
          <TouchableOpacity onPress={handleShowUtdPlaces} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Use current location</Text>
          </TouchableOpacity>
        )}
        {!showUtdPlaces && !showSoccerPlaces && !showBaseballPlaces && !showCricketPlaces && !showBasketballPlaces && !searchQuery && (
          <TouchableOpacity onPress={handleShowSoccerPlaces} style={styles.sportsButton}>
            <Text style={styles.filterButtonText}>Show Soccer Fields</Text>
          </TouchableOpacity>
        )}
        {!showUtdPlaces && !showBaseballPlaces && !showSoccerPlaces && !showCricketPlaces && !showBasketballPlaces && !searchQuery && (
          <TouchableOpacity onPress={handleShowBaseballPlaces} style={styles.sportsButton}>
            <Text style={styles.filterButtonText}>Show Baseball Fields</Text>
          </TouchableOpacity>
        )}
        {!showUtdPlaces && !showCricketPlaces && !showSoccerPlaces && !showBaseballPlaces && !showBasketballPlaces && !searchQuery && (
          <TouchableOpacity onPress={handleShowCricketPlaces} style={styles.sportsButton}>
            <Text style={styles.filterButtonText}>Show Cricket Fields</Text>
          </TouchableOpacity>
        )}
        {!showUtdPlaces && !showBasketballPlaces && !showSoccerPlaces && !showBaseballPlaces && !showCricketPlaces && !searchQuery && (
          <TouchableOpacity onPress={handleShowBasketballPlaces} style={styles.sportsButton}>
            <Text style={styles.filterButtonText}>Show Basketball Courts</Text>
          </TouchableOpacity>
        )}
        <ScrollView style={styles.resultsContainer}>
          {(debouncedSearchQuery && searchResults.length > 0) && searchResults.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectPlaceFromList(result)} style={styles.resultItemContainer}>
              <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultDescription}>{result.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {showUtdPlaces && utdPlaces.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectPlaceFromList(result)} style={styles.resultItemContainer}>
              <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultDescription}>{result.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {showBaseballPlaces && baseballPlaces.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectPlaceFromList(result)} style={styles.resultItemContainer}>
              <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultDescription}>{result.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {showSoccerPlaces && soccerPlaces.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectPlaceFromList(result)} style={styles.resultItemContainer}>
              <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultDescription}>{result.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {showCricketPlaces && cricketPlaces.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectPlaceFromList(result)} style={styles.resultItemContainer}>
              <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultDescription}>{result.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {showBasketballPlaces && basketballPlaces.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectPlaceFromList(result)} style={styles.resultItemContainer}>
              <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultDescription}>{result.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/*Everything related to add event. if u need to make changes so it works with calendar its prob here*/}
        <Modal visible={showDetails} animationType="fade" transparent={true} onRequestClose={() => setShowDetails(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedPlace?.name}</Text>
              <Text style={styles.modalDescription}>{selectedPlace?.description}</Text>
              <Text style={styles.modalDescription}>Availability: {selectedPlace?.availability}</Text>
              <Text style={styles.modalDescription}>Phone Number: {selectedPlace?.phone}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Calendar", {
                      location: selectedPlace?.name, 
                      showCreateEventModal: true,    
                    });
                  }}
                  style={styles.addEventButton}
                >
                  <Text style={styles.addEventText}>Book Event Here</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDetails(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  searchBar: { height: 40, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, marginTop: 10, marginHorizontal: 20, paddingHorizontal: 10, fontSize: 16, backgroundColor: "#fff" },
  resultsContainer: { paddingHorizontal: 20, marginTop: 20, flex: 1 },
  resultItemContainer: { flexDirection: "row", paddingVertical: 15, borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 10, alignItems: "center" },
  resultImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  resultTextContainer: { flex: 1 },
  resultName: { fontSize: 18, fontWeight: "bold" },
  resultDescription: { fontSize: 14, color: "#555" },
  noResultsContainer: { paddingHorizontal: 20, marginTop: 20, alignItems: "center" },
  noResultsText: { fontSize: 16, color: "#888" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerMessageContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, marginTop: 20 },
  centerMessageText: { fontSize: 18, color: "#888", textAlign: "center" },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#007bff", borderRadius: 20, marginTop: 10, marginHorizontal: 20, alignItems: "center" },
  filterButtonText: { color: "#fff", fontSize: 16 },
  sportsButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#e91e63", borderRadius: 20, marginTop: 20, marginHorizontal: 80, alignItems: "center" },
  sportsButtonText: { color: "#fff", fontSize: 16 },
  modalBackdrop: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalDescription: { fontSize: 16, marginBottom: 5 },
  buttonContainer: { marginTop: 20 },
  addEventButton: { backgroundColor: "#007bff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 5, marginBottom: 10 },
  addEventText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: 'bold', },
  closeButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 5, backgroundColor: "#ccc" },
  closeButtonText: { color: "#333", textAlign: "center", fontSize: 16, fontWeight: 'bold', },
  clearButton: { marginRight: 15 },
  clearButtonText: { fontSize: 18, color: '#007bff', },
});

export default Finder;

