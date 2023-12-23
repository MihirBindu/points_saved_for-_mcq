// SignInForm.js

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { signIn } from "./cognitoService"; // Import your cognitoService

const SignInForm = () => {
  const navigation = useNavigation(); // Initialize the useNavigation hook
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      // Call your signIn function from cognitoService
      const session = await signIn(username, password);
      console.log("Sign-in successful:", session);

      // Navigate to LevelButtons screen upon successful sign-in
      navigation.navigate("LevelButtons");

      // Handle other actions upon successful sign-in if needed
    } catch (error) {
      console.error("Sign-in error:", error.message);
      // Handle error, e.g., display an error message to the user
    }
  };

  const goToSignUp = () => {
    navigation.navigate("SignUpForm"); // Navigate to the SignUpForm screen
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
        <Button mode="contained" onPress={handleSignIn} style={styles.button}>
          Sign In
        </Button>
        <TouchableOpacity onPress={goToSignUp}>
          <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
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
  signUpLink: {
    marginTop: 16,
    textAlign: "center",
    color: "blue", // You can customize the color
  },
});

export default SignInForm;
