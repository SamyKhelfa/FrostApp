import React from "react";
import { View, StyleSheet } from "react-native";
import VimeoVideo from "./VimeoVideo"; // Mettez à jour le chemin si nécessaire

const LessonScreen = ({ route }) => {
  const { vimeoId } = route.params;

  return (
    <View style={styles.container}>
      <VimeoVideo vimeoId={vimeoId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0e0e0e",
  },
  // Ajoutez d'autres styles si nécessaire
});

export default LessonScreen;
