import { createDrawerNavigator } from "@react-navigation/drawer";
import CoursesScreen from "./CoursesScreen"; // Votre écran des cours
import CustomDrawerContent from "./CustomDrawerContent"; // Le composant de contenu du tiroir

const Drawer = createDrawerNavigator();

function CourseDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Courses" component={CoursesScreen} />
      {/* Ajoutez d'autres écrans si nécessaire */}
    </Drawer.Navigator>
  );
}

export default CourseDrawerNavigator;
