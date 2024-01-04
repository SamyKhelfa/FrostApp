import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, TouchableOpacity, Text } from "react-native";

import HomeScreen from "./containers/HomeScreen";
import ShowerChallenge from "./containers/ShowerChallenge";
import ProfileScreen from "./containers/ProfileScreen";
import CommunityScreen from "./containers/CommunityScreen";
import SpotsScreen from "./containers/SpotsScreen";
import StoryScreen from "./containers/StoryScreen";
import AcademyScreen from "./containers/AcademyScreen";
import CoursesScreen from "./containers/CoursesScreen";
import LessonScreen from "./containers/LessonScreen";
import LoginScreen from "./containers/LoginScreen";
import SignUpScreen from "./containers/SignUpScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: "Accueil",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{ marginLeft: 10 }}
            >
              <Text>Connexion</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ headerTitle: "Formation" }}
      />
      <Stack.Screen
        name="ShowerChallenge"
        component={ShowerChallenge}
        options={{
          headerTitle: "Défi douche givrée",
        }}
      />
      <Stack.Screen
        name="SpotsScreen"
        component={SpotsScreen}
        options={{ headerTitle: "Spots givrés" }}
      />
      <Stack.Screen
        name="StoryScreen"
        component={StoryScreen}
        options={{ headerTitle: "Mon histoire givrée" }}
      />
      <Stack.Screen
        name="AcademyScreen"
        component={AcademyScreen}
        options={{ headerTitle: "Frost Academy" }}
      />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{ headerTitle: "Détails de la Leçon" }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconColor = focused ? "#4184BF" : "#696969";
            return (
              <Image
                source={
                  route.name === "Accueil"
                    ? focused
                      ? require("./images/home-active.png")
                      : require("./images/home-inactive.png")
                    : route.name === "Espace givré"
                    ? focused
                      ? require("./images/profile-active.png")
                      : require("./images/profile-inactive.png")
                    : route.name === "Communauté"
                    ? focused
                      ? require("./images/community-active.png")
                      : require("./images/community-inactive.png")
                    : null
                }
                style={{ width: 24, height: 24, tintColor: iconColor }}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Accueil"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Espace givré" component={ProfileScreen} />
        <Tab.Screen name="Communauté" component={CommunityScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
