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
  Platform,
} from "react-native";
import { loginUser } from "@/services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const logo = Platform.select({
    ios: require("@/assets/images/just_circle.png"),
    android: require("@/assets/images/just_circle.png"),
    web: require("@/assets/images/logo_no_back_big.svg"),
  });
  const logoStyle = Platform.select({
    ios: styles.mobileLogo,
    android: styles.mobileLogo,
    web: styles.webLogo,
  });

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
            <Image source={logo} style={logoStyle} resizeMode="contain" />
          )}

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            {isMobile ? "Login" : "Welcome Back!"}
          </Text>

          <View style={styles.inputWrapper}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Email</Text>
            </View>

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
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Password</Text>
            </View>
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
            <Image source={logo} style={logoStyle} resizeMode="contain" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3FCFF",
  },

  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F3FCFF",
    flexDirection: "row",
  },

  cardMobile: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 0,
    width: "100%",
    height: "100%",
  },

  form: {
    flex: 1,
    paddingHorizontal: 80,
    justifyContent: "center",
  },

  formMobile: {
    flex: 1,
    width: "100%",
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

  webLogo: {
    width: 600,
    height: 520,
    alignSelf: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#333",
    marginBottom: 50,
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

  labelContainer: {
    position: "absolute",
    top: -12,
    left: 22,

    backgroundColor: "#F3FCFF",
    paddingHorizontal: 10,

    zIndex: 2,
    alignSelf: "flex-start",
  },

  label: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6B6B6B",
  },

  input: {
    height: 45,

    borderWidth: 1.5,
    borderColor: "#8B8B8B",
    borderRadius: 32,

    paddingLeft: 20,
    paddingRight: 20,

    fontSize: 18,
    color: "#555",
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
    marginBottom: 40,
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
