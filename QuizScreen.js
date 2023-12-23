// QuizScreen.js

import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { getItemByPartitionKey } from "./dynamoDbServicemcq";
import { useNavigation } from "@react-navigation/native";
import Card from "./Card"; // Import the Card component

const QuizScreen = ({ route }) => {
  const { selectedLevel, levelPoints, username } = route.params; // Include username in the route params
  const [quizData, setQuizData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const partitionKey = selectedLevel;
        const data = await getItemByPartitionKey(partitionKey);
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error.message);
        // Handle error appropriately
      }
    };

    fetchQuizData();
  }, [selectedLevel]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  console.log("Debug - QuizScreen - username:", username);
  console.log("Debug - QuizScreen - level:", selectedLevel);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {quizData ? (
        <Card
          onPressBack={handleBackPress}
          levelPoints={levelPoints}
          username={username} // Pass username to Card
          level={selectedLevel} // Pass selectedLevel as level to Card
        />
      ) : (
        <Text>Loading quiz data...</Text>
      )}
    </View>
  );
};

export default QuizScreen;
