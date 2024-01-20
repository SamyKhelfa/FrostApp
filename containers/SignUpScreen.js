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
  const [isRegistered, setIsRegistered] = useState(false);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateFields = () => {
    setFirstNameError(!firstName.trim());
    setLastNameError(!lastName.trim());
    setEmailError(!email.trim());
    setPasswordError(!password.trim());
    return (
      firstName.trim() && lastName.trim() && email.trim() && password.trim()
    );
  };

  const handleSignUp = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.222:3000/users/signup",
        { firstName, lastName, email, password }
      );
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userId", response.data._id.toString());
      setIsRegistered(true);
      navigation.navigate("Profile");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data.message
        : error.message;
      Alert.alert("Erreur d'inscription", errorMessage);
    }
  };
  return (
    <View style={styles.container}>
      {isRegistered ? (
        <Text style={styles.successMessage}>
          Inscription réussie! Redirection vers votre profil...
        </Text>
      ) : (
        <>
          {firstNameError && (
            <Text style={styles.errorMessage}>Le prénom est requis.</Text>
          )}
          <TextInput
            placeholder="Prénom"
            value={firstName}
            onChangeText={setFirstName}
            style={[styles.input, firstNameError && styles.errorInput]}
          />

          {lastNameError && (
            <Text style={styles.errorMessage}>Le nom est requis.</Text>
          )}
          <TextInput
            placeholder="Nom"
            value={lastName}
            onChangeText={setLastName}
            style={[styles.input, lastNameError && styles.errorInput]}
          />

          {emailError && (
            <Text style={styles.errorMessage}>L'email est requis.</Text>
          )}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, emailError && styles.errorInput]}
          />

          {passwordError && (
            <Text style={styles.errorMessage}>Le mot de passe est requis.</Text>
          )}
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, passwordError && styles.errorInput]}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </>
      )}
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
