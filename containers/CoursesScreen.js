import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import VimeoVideo from "./VimeoVideo";

const CoursesScreen = () => {
  const [courseData, setCourseData] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
  const [isCoursesVisible, setIsCoursesVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.0.222:3000/courses");
        setCourseData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

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
        courseData.map((module, index) => (
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
