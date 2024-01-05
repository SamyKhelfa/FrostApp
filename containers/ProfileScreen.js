import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";

const ProfileScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text style={styles.title}>Nom d'Utilisateur</Text>
      <Text style={styles.text}>email@example.com</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <Text style={styles.text}>Défis complétés: 10</Text>
        <Text style={styles.text}>Cours suivis: 5</Text>
      </View>

      <View style={styles.section}>
        <Button title="Modifier le Profil" onPress={() => {}} />
        <Button
          title="Changer de Mot de Passe"
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        />
        <Button title="Se Déconnecter" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activités Récents</Text>
        <Text style={styles.text}>
          Dernier cours suivi: Introduction à la respiration givrée
        </Text>
        <Text style={styles.text}>
          Dernier défi relevé: Douche givrée niveau 2
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos Commentaires</Text>
        <Button title="Laisser un Feedback" onPress={() => {}} />
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ProfileScreen;
