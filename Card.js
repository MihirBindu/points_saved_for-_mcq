// Card.js

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useQuizService } from "./QuizService";
import useQuizLogic from "./QuizLogic"; // Import the QuizLogic file

const TinyCard = ({ questionNumber }) => {
  return (
    <View style={styles.tinyCard}>
      <Text style={styles.tinyCardText}>{`Question ${questionNumber}`}</Text>
    </View>
  );
};

const InnerCard = ({ currentQuestion, levelPoints, username, level }) => {
  const { points, handleOptionPress } = useQuizLogic();

  const renderOptions = () => {
    const options = [
      currentQuestion.option1,
      currentQuestion.option2,
      currentQuestion.option3,
      currentQuestion.option4,
    ];

    return options
      .filter((option) => option !== null && option !== undefined)
      .map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() =>
            handleOptionPress(
              points + 1, // Pass the points earned for the question
              username,
              level
            )
          }
        >
          <Text style={styles.optionText}>{` ${option}`}</Text>
        </TouchableOpacity>
      ));
  };

  return (
    <ScrollView style={styles.innerCard}>
      <TinyCard questionNumber={currentQuestion.id} />
      <Text style={styles.pointsText}>{`${
        levelPoints !== undefined
          ? `Points: ${levelPoints + points}`
          : "Loading..."
      }`}</Text>
      <Text style={styles.questionText}>{`${currentQuestion.question}`}</Text>
      {currentQuestion.objectURL && (
        <Image
          source={{ uri: currentQuestion.objectURL }}
          style={styles.image}
        />
      )}
      <View style={styles.optionContainer}>{renderOptions()}</View>
    </ScrollView>
  );
};

const Card = ({ onPressBack, levelPoints, username, level }) => {
  const {
    currentQuestion,
    currentQuestionId,
    loadQuestion,
    handleNext,
    handlePrevious,
  } = useQuizService();

  const { points, handleOptionPress } = useQuizLogic(); // Include useQuizLogic

  return (
    <View style={styles.outerCard}>
      {currentQuestion && (
        <InnerCard
          currentQuestion={currentQuestion}
          levelPoints={levelPoints}
          username={username} // Pass username to InnerCard
          level={level} // Pass level to InnerCard
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePrevious} style={styles.button}>
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressBack} style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={
            () => handleOptionPress(points + 1, username, level) // Pass the points earned for the question
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    margin: 8,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  innerCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    margin: 8,
    backgroundColor: "#eee",
  },
  tinyCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#ddd",
    width: 100,
  },
  tinyCardText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
    alignSelf: "center",
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    left: 220,
    top: -50,
  },
  optionContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "column",
  },
  optionButton: {
    backgroundColor: "#57d7e3",
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 300,
    alignSelf: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#57d7e3",
    borderRadius: 15,
    padding: 2,
    width: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Card;
