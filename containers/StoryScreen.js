import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";

const StoryScreen = ({ navigation }) => {
  <View style={styles.container}>
    <Text style={styles.title}>Mon histoire givrée</Text>
    <Text style={styles.text}>Tu peux ici consulter mon histoire givrée !</Text>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    padding: 20,
  },

  title: {
    fontSize: 30,

    fontWeight: "bold",

    marginBottom: 20,
  },

  text: {
    fontSize: 20,

    marginBottom: 20,
  },
});

export default StoryScreen;
