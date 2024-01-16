import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.222:3000/users/signup",
        {
          firstName,
          lastName,
          email,
          password,
        }
      );

      // Stockage du token et de l'ID de l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userId", response.data._id);

      // Redirection vers la page de profil
      navigation.navigate("Profile");
    } catch (error) {
      console.error(error);
      let message = "Une erreur s'est produite lors de l'inscription.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
      Alert.alert("Erreur", message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 50,
    width: "100%",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#4184BF",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4184BF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  successMessage: {
    fontSize: 18,
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default SignUpScreen;
