import { View, Text, StyleSheet } from "react-native";

type AppToastProps = {
  message: string;
  type: "success" | "error" | "info";
};

export default function AppToast({ message, type }: AppToastProps) {
  return (
    <View style={[styles.toast, styles[type]]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    zIndex: 9999,
    elevation: 20,
  },

  success: {
    backgroundColor: "#1F8A5B",
  },

  error: {
    backgroundColor: "#B42318",
  },

  info: {
    backgroundColor: "#204A78",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
