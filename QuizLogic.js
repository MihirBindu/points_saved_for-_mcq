// QuizLogic.js

import { useState } from "react";
import { saveLevelsToList, savePointsForLevel } from "./DynamoDBService";

export const useQuizLogic = () => {
  const [points, setPoints] = useState(0);

  const handleOptionPress = async (isCorrect, username, level) => {
    console.log("Debug - handleOptionPress - username:", username);
    console.log("Debug - handleOptionPress - level:", level);

    if (isCorrect) {
      // If the selected option is correct, increment points by 1
      setPoints((prevPoints) => prevPoints + 1);

      try {
        console.log("Debug - handleOptionPress - updatedPoints:", points + 1);

        // Save the updated points to DynamoDB
        const updatedPoints = points + 1;
        const levelsData = {
          [level]: {
            points: updatedPoints,
          },
        };

        await saveLevelsToList(username, { levels: levelsData });

        // Save the updated points for the specific level
        await savePointsForLevel(username, level, updatedPoints);
      } catch (error) {
        console.error("Error saving points to DynamoDB:", error.message);
        // Handle error appropriately
      }
    }

    // You can add additional logic here if needed
  };

  return {
    points,
    handleOptionPress,
  };
};

export default useQuizLogic;
