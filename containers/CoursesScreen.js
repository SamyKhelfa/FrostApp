import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const CoursesScreen = () => {
  const videoRef = useRef(null);

  // Construire l'URL d'intégration Vimeo avec les paramètres pour une expérience de visionnage épurée
  const vimeoUrl = `https://vimeo.com/872525023`;

  return (
    <WebView
      source={{ uri: vimeoUrl }}
      style={styles.backgroundVideo}
      ref={videoRef}
      allowsFullscreenVideo
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      // Appliquer d'autres propriétés de configuration de WebView selon les besoins
    />
  );
};

// Styles
const styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1, // La WebView devrait occuper tout l'espace disponible
    backgroundColor: "transparent", // Assurer un fond transparent
  },
});

export default CoursesScreen;
