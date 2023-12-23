// LevelButtons.js

import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuthenticatedUsername } from "./cognitoService";
import useQuizLogic from "./QuizLogic"; // Import the QuizLogic file

const LevelButtons = () => {
  const navigation = useNavigation();
  const { points } = useQuizLogic(); // Use the points from the QuizLogic hook

  const handleLevelPress = (level) => {
    try {
      const username = getAuthenticatedUsername();
      console.log("Fetched username:", username);

      if (username) {
        navigation.navigate("QuizScreen", {
          selectedLevel: level,
          levelPoints: points,
          username,
          level,
        });
      } else {
        console.error("Username is undefined");
      }
    } catch (error) {
      console.error("Error handling level press:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          mode="contained"
          onPress={() => handleLevelPress(1)}
          style={styles.button}
        >
          Level 1
        </Button>
        <Button
          mode="contained"
          onPress={() => handleLevelPress(2)}
          style={styles.button}
        >
          Level 2
        </Button>
      </View>
      <View style={styles.row}>
        <Button
          mode="contained"
          onPress={() => handleLevelPress(3)}
          style={styles.button}
        >
          Level 3
        </Button>
        <Button
          mode="contained"
          onPress={() => handleLevelPress(4)}
          style={styles.button}
        >
          Level 4
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    margin: 20,
  },
});

export default LevelButtons;
