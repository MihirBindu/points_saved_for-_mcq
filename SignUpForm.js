// SignUpForm.js

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { signUp } from "./cognitoService"; // Import your cognitoService

const SignUpForm = () => {
  const navigation = useNavigation(); // Initialize the useNavigation hook
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignUp = async () => {
    try {
      // Call your signUp function from cognitoService
      const result = await signUp(username, password, email);
      console.log("Sign-up successful:", result);
      // Handle navigation or other actions upon successful sign-up
    } catch (error) {
      console.error("Sign-up error:", error.message);
      // Handle error, e.g., display an error message to the user
    }
  };

  const goToSignIn = () => {
    navigation.navigate("SignInForm"); // Navigate to the SignInForm screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSignUp} style={styles.button}>
          Sign Up
        </Button>
        <TouchableOpacity onPress={goToSignIn}>
          <Text style={styles.signInLink}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
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
  form: {
    width: "80%", // Adjust the width as needed
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
  signInLink: {
    marginTop: 16,
    textAlign: "center",
    color: "blue", // You can customize the color
  },
});

export default SignUpForm;
