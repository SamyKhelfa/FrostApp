import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../App"; // Assurez-vous que le chemin d'importation est correct

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { setIsUserLoggedIn } = useContext(AuthContext);

  const validateFields = () => {
    setEmailError(!email.trim());
    setPasswordError(!password.trim());
    return email.trim() && password.trim();
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.222:3000/users/login",
        {
          email,
          password,
        }
      );
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userId", response.data._id.toString());
      setIsUserLoggedIn(true);
      navigation.navigate("Profile"); // Redirigez vers l'écran de profil après la connexion
    } catch (error) {
      Alert.alert(
        "Erreur de connexion",
        "Utilisateur ou mot de passe incorrect."
      );
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Pas encore givré ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpButton}>Inscris-toi !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 50,
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#4184BF",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
  },
  button: {
    width: "100%",
    backgroundColor: "#4184BF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#707070",
    fontSize: 16,
  },
  signUpButton: {
    color: "#4184BF",
    textDecorationLine: "underline",
    fontSize: 16,
    marginLeft: 5,
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
});

export default LoginScreen;
