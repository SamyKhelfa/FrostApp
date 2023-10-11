import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { GOOGLE_PLACES_API_KEY } from "@env";
import AddSpotModal from "./AddSpotModal";

const SpotsScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [temporaryMarkerLocation, setTemporaryMarkerLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const addMarker = () => {
    if (temporaryMarkerLocation) {
      const newMarker = {
        coordinate: temporaryMarkerLocation,
      };
      setMarkers([...markers, newMarker]);
      setTemporaryMarkerLocation(null);
      setModalVisible(true);
    }
  };

  const removeMarker = () => {
    if (selectedLocation) {
      const newMarkers = markers.filter(
        (marker) => marker.coordinate !== selectedLocation
      );
      setMarkers(newMarkers);
      setSelectedLocation(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spots Givrés</Text>

      {/* Barre de recherche avec suggestions */}
      <GooglePlacesAutocomplete
        placeholder="Rechercher un endroit"
        onPress={(data, details = null) => {
          const { lat, lng } = details.geometry.location;
          const selectedLocation = { latitude: lat, longitude: lng };
          setTemporaryMarkerLocation(selectedLocation);
        }}
        fetchDetails={true}
        query={{
          key: "AIzaSyDkv75SV_3izltCCAMNMrtV3RuE8zzjYOs",
          language: "fr",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
        listViewDisplayed="auto"
        enablePoweredByContainer={false}
        styles={{
          container: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          },
          textInputContainer: {
            width: "100%",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: "#5d5d5d",
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
        }}
      />

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => setTemporaryMarkerLocation(e.nativeEvent.coordinate)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={`Spot ${index + 1}`}
              onPress={() => setSelectedLocation(marker.coordinate)}
            />
          ))}

          {temporaryMarkerLocation && (
            <Marker
              coordinate={temporaryMarkerLocation}
              title="Emplacement temporaire"
              pinColor="blue"
            />
          )}
        </MapView>
      )}
      {isModalVisible && <AddSpotModal />}
      <TouchableOpacity onPress={addMarker} style={styles.button}>
        <Text>Ajouter Spot</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={removeMarker} style={styles.button}>
        <Text>Supprimer Spot</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: 300,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#4184BF",
    borderRadius: 5,
  },
});

export default SpotsScreen;
