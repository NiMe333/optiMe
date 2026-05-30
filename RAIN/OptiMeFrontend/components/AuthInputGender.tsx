import { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AuthInputGenderProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const OPTIONS = ["Male", "Female", "Other"];

export default function AuthInputGender({
  label,
  value,
  onChange,
}: AuthInputGenderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>

        <TouchableOpacity style={styles.input} onPress={() => setOpen(true)}>
          <Text style={[styles.inputText, !value && styles.placeholder]}>
            {value || "Select gender"}
          </Text>
          <Ionicons name="chevron-down-outline" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={open} animationType="fade">
        <Pressable
          style={[styles.overlay, Platform.OS === "web" && styles.overlayWeb]}
          onPress={() => setOpen(false)}
        >
          <Pressable style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select gender</Text>

            {OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
    borderRadius: 5,
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
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
  },

  inputText: {
    fontSize: 18,
    color: "#555",
  },

  placeholder: {
    color: "#999",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  overlayWeb: {
    alignItems: "flex-start",
    paddingLeft: "15%",
  },

  modalBox: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#24364A",
    textAlign: "center",
    marginBottom: 12,
  },

  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  optionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
