import { cloneElement, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

import { loginUser } from "@/services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const data = await loginUser(email, password);

      console.log("Login Success", data);
      Alert.alert("Success", "Logged in!");
    } catch (error: any) {
      console.log("Login faild");
      Alert.alert("Error", error.message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "black",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
