import react from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace givré</Text>
      <Text style={styles.text}>
        Tu peux ici consulter ton profil et tes actions passées.
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

export default ProfileScreen;
