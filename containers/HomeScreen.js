import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue mon givré !!</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Courses")}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Espace formation</Text>
            <Image
              style={styles.meditation}
              source={require("../images/meditation.jpg")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ShowerChallenge")}
        >
          <Text style={styles.buttonText}>Défi douche givrée</Text>
          <Image
            style={styles.meditation}
            source={require("../images/shower.jpg")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SpotsScreen")}
        >
          <Text style={styles.buttonText}>Spots givrés</Text>
          <Image
            style={styles.meditation}
            source={require("../images/mountain.jpg")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("StoryScreen")}
        >
          <Text style={styles.buttonText}>Mon histoire givrée</Text>
          <Image
            style={styles.meditation}
            source={require("../images/maxime.jpg")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AcademyScreen")}
        >
          <Text style={styles.buttonText}>Frost Academy</Text>
          <Image
            style={styles.academy}
            source={require("../images/academy.jpg")}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    width: 140,
    height: 140,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    borderColor: "#4184BF",
    borderWidth: 2,
    elevation: 5,
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#696969",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    padding: 20,
  },
  meditation: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4184BF",
  },
  academy: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default HomeScreen;
