import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Alert,
  Platform,
} from "react-native";

import { registerUser } from "@/services/auth";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import AuthInputDatePicker from "@/components/AuthInputDatePicker";
import { styles } from "@/styles/login.styles";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const logo = Platform.select({
    ios: require("@/assets/images/just_circle.png"),
    android: require("@/assets/images/just_circle.png"),
    web: require("@/assets/images/logo_final_web.svg"),
  });

  const logoStyle = isMobile ? styles.mobileLogo : styles.webLogo;

  async function handleRegister() {
    try {
      const formattedDate = dateOfBirth.toISOString().split("T")[0];
      const data = await registerUser(email, password, gender, formattedDate);
      console.log("Register Success", data);
      Alert.alert("Success", "Registered!");
    } catch (error: any) {
      console.log("Register failed", error);
      Alert.alert("Error", error?.message || "Register failed");
    }
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <View style={[styles.form, isMobile && styles.formMobile]}>
          {isMobile && (
            <Image source={logo} style={logoStyle} resizeMode="contain" />
          )}

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            {isMobile ? "Register" : "Create Account"}
          </Text>

          <AuthInput
            label="Email"
            placeholder="email@gmail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AuthInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <AuthInput
            label="Gender"
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            placeholderTextColor="#999"
          />

          <AuthInputDatePicker
            label="Date of birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
          />

          <AuthButton title="Register" onPress={handleRegister} />

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!isMobile && (
          <View style={styles.logoSection}>
            <Image source={logo} style={logoStyle} resizeMode="contain" />
          </View>
        )}
      </View>
    </View>
  );
}
