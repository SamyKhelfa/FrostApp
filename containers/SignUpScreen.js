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

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // État pour gérer l'affichage du message de succès

  const handleSignUp = async () => {
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
      console.log(response.data);
      setIsRegistered(true); // Mise à jour de l'état pour afficher le message de succès

      // Rediriger vers la page de profil après un délai
      setTimeout(() => {
        navigation.navigate("Profile");
      }, 3000);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        // Si l'e-mail existe déjà
        Alert.alert("Erreur", "Cet e-mail est déjà utilisé.");
      } else {
        // Pour d'autres types d'erreurs
        Alert.alert(
          "Erreur",
          "Une erreur s'est produite lors de l'inscription."
        );
      }
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
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà givré ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginButton}>Connecte-toi !</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#4184BF",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#707070",
    fontSize: 16,
  },
  loginButton: {
    color: "#4184BF",
    textDecorationLine: "underline",
    fontSize: 16,
    marginLeft: 5,
  },
  successMessage: {
    fontSize: 18,
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default SignUpScreen;
