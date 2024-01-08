import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Récupérer l'ID de l'utilisateur
        const token = await AsyncStorage.getItem("userToken"); // Récupérer le token de l'utilisateur
        const response = await axios.get(
          `http://192.168.0.222:3000/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur:",
          error
        );
      }
    };

    getUserInfo();
  }, []);

  if (!userInfo) {
    return <Text>Chargement des données utilisateur...</Text>; // Affichage pendant le chargement des données
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: userInfo.profilePicture || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>
        {userInfo.firstName} {userInfo.lastName}
      </Text>
      <Text style={styles.text}>{userInfo.email}</Text>

      {/* Sections supplémentaires basées sur les données de userInfo */}

      <View style={styles.section}>
        <Button
          title="Modifier le Profil"
          onPress={() => {
            /* Logique pour modifier le profil */
          }}
        />
        <Button
          title="Changer de Mot de Passe"
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        />
        <Button
          title="Se Déconnecter"
          onPress={() => {
            /* Logique pour se déconnecter */
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
  },
  section: {
    marginTop: 20,
  },
  // ... Autres styles si nécessaire
});

export default ProfileScreen;
