import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const AddSpotModal = ({ onSave, onClose }) => {
  const [description, setDescription] = useState("");
  const [photoUri, setPhotoUri] = useState(null);

  const requestStoragePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Désolé, nous avons besoin de ta permission pour accéder à tes photos"
      );
    }
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhotoUri(result.uri);
    }
  };

  const handleSave = () => {
    onSave({ description, photoUri });
    setDescription("");
    setPhotoUri(null);
    onClose();
  };

  const handleCancel = () => {
    setDescription("");
    setPhotoUri(null);
    onClose();
  };

  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Ajouter un Spot</Text>
        <TextInput
          style={styles.input}
          value={description}
          placeholder="Description du spot"
          onChangeText={(text) => setDescription(text)}
        />
        <TouchableOpacity onPress={handlePickImage} style={styles.button}>
          <Text>Ajouter une photo</Text>
        </TouchableOpacity>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
        )}
        <Button title="Enregistrer" onPress={handleSave} />
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text>Annuler</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4184BF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default AddSpotModal;
