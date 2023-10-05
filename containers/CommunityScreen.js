import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";

const CommunityScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Communauté</Text>
      <Text style={styles.text}>
        Tu peux ici consulter les actions des autres utilisateurs de
        l'application et les encourager en cliquant sur le bouton "J'aime" !
      </Text>
    </View>
  );
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default CommunityScreen;
