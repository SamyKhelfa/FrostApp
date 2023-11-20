import React, { useState, useRef } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Button,
} from "react-native";
import VimeoVideo from "./VimeoVideo";

// Simulate data that might come from an API
const courseData = [
  {
    moduleId: "1",
    title: "🎯 Module 1: Vision, objectif et plan d'action sur-mesure",
    lessons: [
      {
        title: "Introduction",
        vimeoId: "872525023",
      },
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
];

const Module = ({
  module,
  onLessonSelect,
  isVisible,
  selectedModuleId,
  selectedLessonIndex,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleModule = () => {
    setExpanded(!expanded);
  };

  return (
    isVisible && (
      <View style={styles.moduleContainer}>
        <TouchableOpacity style={styles.moduleHeader} onPress={toggleModule}>
          <Text
            style={[
              styles.moduleTitle,
              module.moduleId === selectedModuleId && styles.highlight,
            ]}
          >
            {module.title}
          </Text>
        </TouchableOpacity>
        {expanded &&
          module.lessons.map((lesson, index) => (
            <TouchableOpacity
              key={index}
              style={styles.lessonItem}
              onPress={() => onLessonSelect(module.moduleId, index)}
            >
              <Text
                style={[
                  styles.lessonText,
                  module.moduleId === selectedModuleId &&
                    index === selectedLessonIndex &&
                    styles.highlight,
                ]}
              >
                {lesson.title}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    )
  );
};

const CoursesScreen = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
  const [isCoursesVisible, setIsCoursesVisible] = useState(true);

  const handleLessonSelect = (moduleId, lessonIndex) => {
    const selectedModule = courseData.find(
      (module) => module.moduleId === moduleId
    );
    setSelectedLesson(selectedModule.lessons[lessonIndex]);
    setSelectedModuleId(moduleId);
    setSelectedLessonIndex(lessonIndex);
    setIsCoursesVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => setIsCoursesVisible(!isCoursesVisible)}
      >
        <Text style={styles.buttonText}>
          {isCoursesVisible ? "Cacher les Cours" : "Afficher les Cours"}
        </Text>
      </TouchableOpacity>
      {isCoursesVisible &&
        courseData.map((module) => (
          <Module
            key={module.moduleId}
            module={module}
            onLessonSelect={handleLessonSelect}
            isVisible={isCoursesVisible}
            selectedModuleId={selectedModuleId}
            selectedLessonIndex={selectedLessonIndex}
          />
        ))}
      {selectedLesson && <VimeoVideo vimeoId={selectedLesson.vimeoId} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  moduleContainer: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#f0f0f0",
  },
  moduleHeader: {
    padding: 15,
    backgroundColor: "#1a1a1a",
    borderColor: "#000000",
  },
  moduleTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  lessonItem: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  lessonText: {
    color: "#000000",
    fontSize: 16,
  },
  highlight: {
    backgroundColor: "#212f65",
    color: "#FFFFFF",
  },
  buttonStyle: {
    backgroundColor: "#4a90e2",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default CoursesScreen;
