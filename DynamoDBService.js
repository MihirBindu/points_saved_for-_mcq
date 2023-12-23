// DynamoDBService.js
import AWS from "aws-sdk";
import { awsConfig } from "./awsConfig";

AWS.config.update(awsConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "merge_forms";

export const getItemByUsername = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    console.log("Existing Item:", result.Item);

    if (!result.Item) {
      throw new Error("Item not found for the provided username");
    }

    return result.Item;
  } catch (error) {
    console.error("Error fetching item from DynamoDB:", error.message);
    throw error;
  }
};

export const saveLevelsToList = async (username, levelsData) => {
  if (typeof username !== "string" || !levelsData || !levelsData.levels) {
    throw new Error("Invalid input for saving levels data");
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    UpdateExpression: "SET levels = :levelsData",
    ExpressionAttributeValues: {
      ":levelsData": levelsData,
    },
  };

  try {
    await dynamoDB.update(params).promise();
  } catch (error) {
    console.error("Error saving levels data to DynamoDB:", error.message);
    throw error;
  }
};

export const getPointsForLevel = async (username, level) => {
  if (typeof username !== "string" || typeof level !== "string") {
    throw new Error("Invalid input for fetching points");
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    ProjectionExpression: "levels",
  };

  try {
    const result = await dynamoDB.get(params).promise();

    console.log(
      `Fetching Points Data for Level ${level} - DynamoDB Result:`,
      result
    );

    if (!result.Item || !result.Item.levels) {
      console.error(`Levels data not found for username ${username}`);
      throw new Error(
        `Levels data not found for username ${username} and level ${level}`
      );
    }

    const levelsData = result.Item.levels;

    let pointsData;

    // Check if the points data is nested within an additional "levels" property
    if (levelsData.levels && levelsData.levels[level]) {
      pointsData = levelsData.levels[level].points;
    } else if (levelsData[level]) {
      pointsData = levelsData[level].points;
    } else {
      console.error(`Points data not found for level ${level}`);
      throw new Error(
        `Points data not found for username ${username} and level ${level}`
      );
    }

    const pointsValue = pointsData.N || pointsData;

    console.log(`Points Data for Level ${level}:`, pointsValue);

    return parseInt(pointsValue, 10);
  } catch (error) {
    console.error(
      `Error fetching points data for username ${username} and level ${level}:`,
      error.message
    );
    throw error;
  }
};

export const getLevelsData = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    ProjectionExpression: "levels",
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item && result.Item.levels ? result.Item.levels : null;
  } catch (error) {
    console.error("Error fetching levels data from DynamoDB:", error.message);
    throw error;
  }
};

export const savePointsForLevel = async (username, level, points) => {
  console.log("Debug - savePointsForLevel - username:", username);
  console.log("Debug - savePointsForLevel - level:", level);
  console.log("Debug - savePointsForLevel - points:", points);

  // Ensure that level is treated as a string
  level = level.toString();

  if (
    typeof username !== "string" ||
    typeof level !== "string" ||
    typeof points !== "number" ||
    isNaN(points) || // Check if points is NaN
    points < 0
  ) {
    console.error("Invalid input for saving points");
    throw new Error("Invalid input for saving points");
  }

  const expressionAttributeNames = {
    "#points": `levels.${level}.points`,
  };

  const expressionAttributeValues = {
    ":pointsValue": points,
  };

  const updateExpression = "SET #points = :pointsValue";

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamoDB.update(params).promise();
  } catch (error) {
    console.error(
      `Error saving points for level ${level} to DynamoDB:`,
      error.message
    );
    throw error;
  }
};
