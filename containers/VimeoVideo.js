import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const VimeoVideo = ({ vimeoId }) => {
  const vimeoUrl = `https://player.vimeo.com/video/${vimeoId}`;

  return (
    <WebView
      source={{ uri: vimeoUrl }}
      style={styles.backgroundVideo}
      allowsFullscreenVideo
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
    />
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    height: 200, // Ajustez la hauteur selon vos besoins
    width: "100%",
    marginBottom: 10, // Espacement entre les vidéos
  },
});

export default VimeoVideo;
