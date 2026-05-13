import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";

import { registerUser } from "@/services/auth";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import AuthInputDatePicker from "@/components/AuthInputDatePicker";
import AuthInputGender from "@/components/AuthInputGender";
import { styles } from "@/styles/login.styles";
import { router } from "expo-router";
import { useToast } from "@/context/ToastContext";
import AuthPasswordInput from "@/components/AuthPasswordInput";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const logo = Platform.select({
    ios: require("@/assets/images/just_circle.png"),
    android: require("@/assets/images/just_circle.png"),
    web: require("@/assets/images/logo_final_web.svg"),
  });

  const logoStyle = isMobile ? styles.mobileLogo : styles.webLogo;

  async function handleRegister() {
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      showToast("Email is required", "error");
      return;
    }

    if (!cleanEmail.includes("@")) {
      showToast("Invalid email format", "error");
      return;
    }

    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (!gender) {
      showToast("Please select gender", "error");
      return;
    }

    if (!dateOfBirth || isNaN(dateOfBirth.getTime())) {
      showToast("Please select a valid date of birth", "error");
      return;
    }

    try {
      setLoading(true);

      const formattedDate =
        dateOfBirth instanceof Date && !isNaN(dateOfBirth.getTime())
          ? dateOfBirth.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

      const data = await registerUser(
        cleanEmail,
        password,
        gender,
        formattedDate,
      );

      console.log("Register Success", data);

      showToast(data.message || "User registered successfully", "success");

      router.replace("/auth/login");
    } catch (error: any) {
      console.log("Register failed", error);

      showToast(error?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
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

          <AuthPasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />

          <AuthInputGender label="Gender" value={gender} onChange={setGender} />

          <AuthInputDatePicker
            label="Date of birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
          />

          <AuthButton
            title={loading ? "Registering..." : "Register"}
            onPress={handleRegister}
          />
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
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
