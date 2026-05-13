import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
} from "react-native";

type AuthPasswordInputProps = TextInputProps & {
  label: string;
};

export default function AuthPasswordInput({
  label,
  style,
  ...props
}: AuthPasswordInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholderTextColor="#777"
          style={[styles.input, style]}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        <Pressable
          onPress={() => setPasswordVisible((prev) => !prev)}
          style={styles.showButton}
          hitSlop={10}
        >
          <Text style={styles.showButtonText}>
            {passwordVisible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    marginBottom: 28,
  },

  labelContainer: {
    position: "absolute",
    top: -12,
    left: 22,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    zIndex: 2,
    alignSelf: "flex-start",
    borderRadius: 5,
  },

  label: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6B6B6B",
  },

  passwordContainer: {
    position: "relative",
  },

  input: {
    height: 45,
    borderWidth: 1.5,
    borderColor: "#8B8B8B",
    borderRadius: 32,
    paddingLeft: 20,
    paddingRight: 75,
    fontSize: 18,
    color: "#555",
  },

  showButton: {
    position: "absolute",
    right: 22,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  showButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#6B6B6B",
  },
});
