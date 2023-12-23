// QuizService.js
import { useState, useEffect } from "react";
import {
  getItemByPartitionKey,
  getTotalQuestionsCount,
} from "./dynamoDbServicemcq";

export const useQuizService = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    loadQuestion(currentQuestionId);
  }, [currentQuestionId]);

  const loadQuestion = async (questionId) => {
    try {
      const question = await getItemByPartitionKey(questionId);
      setCurrentQuestion(question);
    } catch (error) {
      console.error("Error loading question:", error.message);
    }
  };

  const handleNext = async () => {
    const totalQuestionsCount = await getTotalQuestionsCount();
    if (currentQuestionId < totalQuestionsCount) {
      setCurrentQuestionId((prevId) => prevId + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionId > 1) {
      setCurrentQuestionId((prevId) => prevId - 1);
    }
  };

  return {
    currentQuestion,
    currentQuestionId,
    loadQuestion,
    handleNext,
    handlePrevious,
  };
};
