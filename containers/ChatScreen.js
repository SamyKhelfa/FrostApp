import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import io from "socket.io-client";
import { AuthContext } from "../App"; // Importez AuthContext pour accéder à l'ID de l'utilisateur

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId } = useContext(AuthContext); // Utilisez l'ID de l'utilisateur connecté

  useEffect(() => {
    socket = io("http://192.168.0.222:3000");

    // Connectez l'utilisateur à son salon personnel dès la connexion
    socket.on("connect", () => {
      console.log("Connecté au serveur de chat");
      socket.emit("user_connected", userId); // Envoyez l'ID de l'utilisateur au serveur
    });

    // Écoutez les messages privés envoyés à cet utilisateur
    socket.on("new_private_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (receiverId) => {
    if (message.trim()) {
      // Envoyez un message privé avec l'ID de l'émetteur, l'ID du destinataire et le message
      socket.emit("private_message", {
        senderId: userId,
        receiverId, // Vous devez définir comment obtenir l'ID du destinataire
        message,
      });
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message here..."
        />
        <Button
          title="Send"
          onPress={() => sendMessage(/* ID du destinataire ici */)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  messageText: {
    fontSize: 18,
  },
});

export default ChatScreen;
