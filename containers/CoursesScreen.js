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
      { title: "Introduction", vimeoId: "872525023" },
      {
        title: "Clarification de la vision avec le froid",
        vimeoId: "872527912",
      },
      {
        title: "Ton nouvel objectif avec la douche froide",
        vimeoId: "872530511",
      },
      {
        title: "3 méthodes pour prendre des douches froides",
        vimeoId: "872531319",
      },
      {
        title: "Construction de ton plan d’action sur-mesure",
        vimeoId: "872532012",
      },
      { title: "L'état d'esprit indispensable pour toi", vimeoId: "872533537" },
    ],
  },
  {
    moduleId: "2",
    title: "🧊 Module 2 : 7 techniques pour améliorer ton rapport au froid",
    lessons: [
      {
        title: "Comment bien respirer sous tes douches froides",
        vimeoId: "872534368",
      },
      {
        title:
          "Tips simples et puissants pour te sentir plus à l'aise avec le froid",
        vimeoId: "872535440",
      },
    ],
  },
  {
    moduleId: "3",
    title: "🗓️ Module 3 : Routine solide et régularité",
    lessons: [
      {
        title:
          "Le best moment de la journée pour tes douches froides (pour toi)",
        vimeoId: "872536608",
      },
      {
        title: "Faut-il arrêter les douches chaudes ?",
        vimeoId: "872538611",
      },
      {
        title: "Faire de la douche froide une habitude quotidienne et solide",
        vimeoId: "872539834",
      },
      {
        title: "La règle d'or pour être régulier(ère)",
        vimeoId: "872540578",
      },
      {
        title:
          "Réduire ta procrastination pour passer à l’action plus facilement",
        vimeoId: "872541362",
      },
      {
        title: "L'outil magique pour booster ta régularité et ta satisfaction",
        vimeoId: "872542849",
      },
    ],
  },
  // ... Ajoutez d'autres modules ici
];

const Module = ({ module, onLessonSelect, onModuleToggle }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleModule = () => {
    if (expanded) {
      onModuleToggle(); // Appelée quand le module est fermé
    }
    setExpanded(!expanded);
  };

  return (
    <View style={styles.moduleContainer}>
      <TouchableOpacity style={styles.moduleHeader} onPress={toggleModule}>
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

  const handleModuleToggle = () => {
    setSelectedLesson(null); // Réinitialise la leçon sélectionnée lorsque le module est fermé
  };

  return (
    <ScrollView style={styles.container}>
      {courseData.map((module, index) => (
        <Module
          key={module.moduleId}
          module={module}
          onLessonSelect={handleLessonSelect}
          onModuleToggle={handleModuleToggle} // Ajout de la nouvelle fonction de gestion
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
