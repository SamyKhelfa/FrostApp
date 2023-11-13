import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import VimeoVideo from "./VimeoVideo"; // Assurez-vous que le chemin vers ce fichier est correct.

// Simulate data that might come from an API
const courseData = [
  {
    moduleId: "1",
    title: "🎯 Module 1: Vision, objectif et plan d'action sur-mesure",
    lessons: [
      { title: "Introduction", vimeoId: "872525023" }, // Remplacez avec les ID Vimeo réels
      {
        title: "Clarification de la vision avec le froid",
        vimeoId: "872527912",
      },
      // ... et ainsi de suite pour les autres leçons
    ],
  },
  // ... Ajoutez d'autres modules ici
];

const Module = ({ module, onLessonSelect }) => {
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
            onPress={() => onLessonSelect(module.moduleId, index)}
          >
            <Text style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const CoursesScreen = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonSelect = (moduleId, lessonIndex) => {
    setSelectedLesson({ moduleId, lessonIndex });
  };

  return (
    <ScrollView style={styles.container}>
      {courseData.map((module, index) => (
        <Module
          key={module.moduleId}
          module={module}
          onLessonSelect={handleLessonSelect}
        />
      ))}
      {selectedLesson && (
        <VimeoVideo
          vimeoId={
            courseData.find(
              (module) => module.moduleId === selectedLesson.moduleId
            ).lessons[selectedLesson.lessonIndex].vimeoId
          }
        />
      )}
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
  // Add other styles you may need
});

export default CoursesScreen;
