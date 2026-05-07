import { Text, TouchableOpacity, StyleSheet } from "react-native";

type AuthButtonProps = {
  title: string;
  onPress: () => void;
};

export default function AuthButton({ title, onPress }: AuthButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
