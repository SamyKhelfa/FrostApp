// CoursesScreen.js

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import VimeoVideo from "./VimeoVideo";
import courseData from "./CourseData"; // Importez les données des cours ici

const Module = ({ module, onSelectLesson }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.moduleContainer}>
      <TouchableOpacity
        style={styles.moduleHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.moduleTitle}>{module.title}</Text>
      </TouchableOpacity>
      {expanded &&
        module.lessons.map((lesson, index) => (
          <TouchableOpacity
            key={index}
            style={styles.lessonItem}
            onPress={() => onSelectLesson(lesson)}
          >
            <Text style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const CoursesScreen = ({ route }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    if (route.params?.selectedLesson) {
      setSelectedLesson(route.params.selectedLesson);
    }
  }, [route.params?.selectedLesson]);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <ScrollView style={styles.container}>
      {courseData.map((module) => (
        <Module
          key={module.moduleId}
          module={module}
          onSelectLesson={handleSelectLesson}
        />
      ))}
      {selectedLesson && <VimeoVideo vimeoId={selectedLesson.vimeoId} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  moduleContainer: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  moduleHeader: {
    padding: 15,
    backgroundColor: "#1a1a1a",
  },
  moduleTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  lessonItem: {
    padding: 15,
    backgroundColor: "#262626",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  lessonText: {
    color: "#ddd",
  },
  // Ajoutez d'autres styles si nécessaire
});

export default CoursesScreen;
