import React, { useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import Video, { VideoRef } from "react-native-video";

const ExercisesScreen = () => {
  const videoRef = useRef < VideoRef > null;

  // Callback lorsque la vidéo est en cours de mise en mémoire tampon
  const onBuffer = (isBuffering) => {
    if (isBuffering) {
      console.log("La vidéo est en cours de mise en mémoire tampon...");
    } else {
      console.log("La mise en mémoire tampon de la vidéo est terminée.");
    }
  };

  // Callback lorsque la vidéo ne peut pas être chargée
  const onError = (error) => {
    console.error("Erreur lors du chargement de la vidéo :", error);
  };

  return (
    <Video
      // Peut être une URL ou un fichier local.
      source={"https://www.youtube.com/watch?v=kzkwrxxdBIw"}
      // Enregistrer la référence
      ref={videoRef}
      // Callback lorsque la vidéo est en cours de mise en mémoire tampon
      onBuffer={onBuffer}
      // Callback lorsque la vidéo ne peut pas être chargée
      onError={onError}
      style={styles.backgroundVideo}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default ExercisesScreen;
