import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native";

import { loginUser } from "@/services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  async function handleLogin() {
    try {
      const data = await loginUser(email, password);

      console.log("Login Success", data);
      Alert.alert("Success", "Logged in!");
    } catch (error: any) {
      console.log("Login failed", error);
      Alert.alert("Error", error?.message || "Login failed");
    }
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <View style={[styles.form, isMobile && styles.formMobile]}>
          {isMobile && (
            <Image
              source={require("../assets/images/optime_logo_1.png")}
              style={styles.mobileLogo}
              resizeMode="contain"
            />
          )}

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            {isMobile ? "Login" : "Welcome Back!!"}
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="email@gmail.com"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!isMobile && (
          <View style={styles.logoSection}>
            <Image
              source={require("../assets/images/optime_logo_1.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },

  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F3FCFF",
    flexDirection: "row",
  },

  cardMobile: {
    flexDirection: "column",
    borderRadius: 34,
  },

  form: {
    flex: 1,
    paddingHorizontal: 80,
    justifyContent: "center",
  },

  formMobile: {
    paddingHorizontal: 30,
    paddingTop: 42,
    paddingBottom: 34,
    justifyContent: "flex-start",
  },

  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 60,
  },

  logo: {
    width: 500,
    height: 500,
  },

  mobileLogo: {
    width: 190,
    height: 145,
    alignSelf: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#3A3A3A",
    textAlign: "center",
    marginBottom: 44,
  },

  titleMobile: {
    fontSize: 46,
    fontWeight: "700",
    color: "#24364A",
    textAlign: "left",
    marginBottom: 50,
  },

  inputWrapper: {
    position: "relative",
    marginBottom: 28,
  },

  label: {
    position: "absolute",
    top: -12,
    left: 38,
    backgroundColor: "#F3FCFFa",
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    zIndex: 2,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#9A9A9A",
    borderRadius: 28,
    paddingHorizontal: 36,
    fontSize: 15,
    color: "#24364A",
  },

  forgot: {
    alignSelf: "flex-end",
    marginTop: -12,
    marginBottom: 56,
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#204A78",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  signupText: {
    color: "#B3AAA5",
    fontSize: 13,
    fontWeight: "500",
  },

  signupLink: {
    color: "#24364A",
    fontSize: 13,
    fontWeight: "800",
  },
});
