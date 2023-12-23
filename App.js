// App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import LevelButtons from "./LevelButtons";
import QuizScreen from "./QuizScreen";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm"; // Import your SignInForm component

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignUpForm"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignUpForm" component={SignUpForm} />
          <Stack.Screen name="SignInForm" component={SignInForm} />
          <Stack.Screen name="LevelButtons" component={LevelButtons} />
          <Stack.Screen name="QuizScreen" component={QuizScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
