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
  const [programData, setProgramData] = useState([]);
  const [expandedProgramId, setExpandedProgramId] = useState(null);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.0.222:3000/programs");
        setProgramData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const toggleProgram = (programId) => {
    if (expandedProgramId === programId) {
      setExpandedProgramId(null);
      setExpandedCourseId(null);
      setSelectedLesson(null);
    } else {
      setExpandedProgramId(programId);
    }
  };

  const toggleCourse = (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      setSelectedLesson(null);
    } else {
      setExpandedCourseId(courseId);
    }
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <ScrollView style={styles.container}>
      {programData.map((program) => (
        <Program
          key={program._id}
          program={program}
          onToggleProgram={() => toggleProgram(program._id)}
          expandedProgram={expandedProgramId === program._id}
          onToggleCourse={toggleCourse}
          expandedCourseId={expandedCourseId}
          onLessonSelect={handleLessonSelect}
        />
      ))}
      {selectedLesson && (
        <View>
          <VimeoVideo vimeoId={selectedLesson.vimeoId} />
          <Text>{selectedLesson.text}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const Program = ({
  program,
  onToggleProgram,
  expandedProgram,
  onToggleCourse,
  expandedCourseId,
  onLessonSelect,
}) => {
  return (
    <View style={styles.programContainer}>
      <TouchableOpacity style={styles.programHeader} onPress={onToggleProgram}>
        <Text style={styles.programTitle}>{program.programTitle}</Text>
      </TouchableOpacity>
      {expandedProgram &&
        program.courses.map((course) => (
          <Course
            key={course._id}
            course={course}
            onToggleCourse={() => onToggleCourse(course._id)}
            expanded={expandedCourseId === course._id}
            onLessonSelect={onLessonSelect}
          />
        ))}
    </View>
  );
};

const Course = ({ course, onToggleCourse, expanded, onLessonSelect }) => {
  return (
    <View style={styles.courseContainer}>
      <TouchableOpacity style={styles.courseHeader} onPress={onToggleCourse}>
        <Text style={styles.courseTitle}>{course.title}</Text>
      </TouchableOpacity>
      {expanded &&
        course.lessons.map((lesson, index) => (
          <TouchableOpacity
            key={index}
            style={styles.lessonItem}
            onPress={() => onLessonSelect(lesson)}
          >
            <Text style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  programContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  programHeader: {
    padding: 15,
    backgroundColor: "#1a1a1a",
  },
  programTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 20,
  },
  courseContainer: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#f0f0f0",
  },
  courseHeader: {
    padding: 15,
    backgroundColor: "#1a1a1a",
  },
  courseTitle: {
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
