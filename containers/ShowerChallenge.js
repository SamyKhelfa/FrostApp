import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

const ShowerChallenge = () => {
  const [markedDates, setMarkedDates] = useState({});

  // Fonction pour gérer la sélection de dates
  const handleDateSelect = (date) => {
    const selectedDate = date.dateString;
    const updatedMarkedDates = { ...markedDates };

    // Vérifiez si la date est déjà marquée, sinon, marquez-la
    if (updatedMarkedDates[selectedDate]) {
      delete updatedMarkedDates[selectedDate];
    } else {
      updatedMarkedDates[selectedDate] = { marked: true, selected: true };
    }

    setMarkedDates(updatedMarkedDates);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sur ce calendrier, tu peux noter les jours où tu as pris ta douche
        froide !
      </Text>
      <Calendar
        // Personnalisez les options du calendrier selon vos besoins
        onDayPress={handleDateSelect}
        markedDates={markedDates}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ShowerChallenge;
