import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../App"; // Assurez-vous que le chemin d'importation est correct
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const { setIsUserLoggedIn } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Désolé, nous avons besoin des permissions de la galerie pour que cela fonctionne!"
          );
        }
      }
    })();
    const getUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Assurez-vous que c'est la bonne clé
        const token = await AsyncStorage.getItem("userToken"); // Et pour le token également
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    setIsUserLoggedIn(false); // Mettre à jour l'état de connexion
    navigation.navigate("Home");
  };

  if (!userInfo) {
    return <Text>Chargement des données utilisateur...</Text>;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      // Ici, vous pouvez également appeler une fonction pour envoyer l'image au serveur si nécessaire
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      // Même chose ici pour l'envoi de la photo
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: profileImage || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Button title="Choisir une image" onPress={pickImage} />
      <Button title="Prendre une photo" onPress={takePhoto} />
      <Text style={styles.title}>
        {userInfo.firstName} {userInfo.lastName}
      </Text>
      <Text style={styles.text}>{userInfo.email}</Text>

      {/* Ajouter d'autres sections selon les besoins */}

      <View style={styles.section}>
        <Button
          title="Modifier le Profil"
          onPress={() => {
            /* Logique de modification du profil */
          }}
        />
        <Button
          title="Changer de Mot de Passe"
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        />
        <Button title="Se Déconnecter" onPress={handleLogout} />
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
  // Autres styles si nécessaire
});

export default ProfileScreen;
