import React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useFonts } from "expo-font";

// IMPORT NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// IMPORT CÁC MÀN HÌNH
import Welcome from "./src/screens/Welcome";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Home from "./src/screens/Home";
import Recent from "./src/screens/Recent";
import Stats from "./src/screens/Stats";
import Profile from "./src/screens/Profile";

// IMPORT MENU CỦA BẠN
import NavigationBar from "./src/components/NavigationBar";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- CẤU HÌNH TAB BAR (MENU CỐ ĐỊNH) ---
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        // Lấy tên màn hình hiện tại để highlight icon
        const currentRoute = state.routes[state.index].name;

        const handleTabPress = (tabName) => {
          if (tabName === "Scan") {
            Alert.alert("Scan", "Mở tính năng quét QR...");
          } else {
            navigation.navigate(tabName);
          }
        };

        return (
          <NavigationBar activeTab={currentRoute} onTabPress={handleTabPress} />
        );
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Recent" component={Recent} />
      {/* Nút Scan không cần màn hình, logic đã xử lý ở tabBar trên */}
      <Tab.Screen name="Stats" component={Stats} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1F41BB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />

        {/* QUAN TRỌNG: Chuyển hướng vào cụm Tab thay vì Home lẻ */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
