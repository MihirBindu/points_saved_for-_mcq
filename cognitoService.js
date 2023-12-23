// cognitoService.js

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { awsConfig } from "./awsConfig";
import AWS from "aws-sdk";
import { saveLevelsToList, getLevelsData } from "./DynamoDBService"; // Import DynamoDBService

AWS.config.update(awsConfig);

const poolData = {
  UserPoolId: "ap-south-1_Fc4Pis601",
  ClientId: "41rc2rlggta8m5gsj2if48u247",
};

const userPool = new CognitoUserPool(poolData);

let authenticatedUsername = null; // Variable to store the authenticated username

export const signUp = async (username, password, email) => {
  const attributeList = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "name", Value: username }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(
      username,
      password,
      attributeList,
      null,
      async (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Sign-up successful, save the username to DynamoDB
          try {
            await saveUsernameToDynamoDB(username);
            console.log(`Username ${username} saved to DynamoDB successfully`);
            resolve(result);
          } catch (dynamoError) {
            console.error(
              "Error saving username to DynamoDB:",
              dynamoError.message
            );
            reject(dynamoError);
          }
        }
      }
    );
  });
};

export const confirmSignUp = async (username, verificationCode) => {
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(
      verificationCode,
      true,
      async (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const signIn = async (username, password) => {
  const authenticationData = {
    Username: username,
    Password: password,
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise(async (resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async (session) => {
        // Set the authenticated username
        authenticatedUsername = username;

        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

// Function to get the authenticated username
export const getAuthenticatedUsername = () => {
  return authenticatedUsername;
};

// Function to save username to DynamoDB
export const saveUsernameToDynamoDB = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: "merge_forms", // Replace with your DynamoDB table name
    Item: {
      username: username,
    },
  };

  try {
    await new AWS.DynamoDB.DocumentClient().put(params).promise();
  } catch (error) {
    console.error("Error saving username to DynamoDB:", error.message);
    throw error;
  }
};
