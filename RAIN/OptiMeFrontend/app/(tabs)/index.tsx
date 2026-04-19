import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Home</Text>

      <Pressable
        onPress={() => router.push("/register")}
        style={{
          backgroundColor: "black",
          padding: 12,
          marginTop: 20,
          marginBottom: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white" }}>Go to Register</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/login")}
        style={{
          backgroundColor: "black",
          padding: 12,
          marginTop: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white" }}>Go to Login</Text>
      </Pressable>
    </View>
  );
}


