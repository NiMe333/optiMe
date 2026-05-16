import { View, Text, StyleSheet, Pressable } from "react-native";

type AppToastProps = {
  message: string;
  type: "success" | "error" | "info";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function AppToast({
  message,
  type,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: AppToastProps) {
  const hasActions = onConfirm || onCancel;

  return (
    <View
      style={[styles.toast, styles[type], hasActions && styles.toastConfirm]}
    >
      <Text style={styles.text}>{message}</Text>

      {hasActions && (
        <View style={styles.actions}>
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>{cancelText || "Ne"}</Text>
          </Pressable>

          <Pressable onPress={onConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmText}>{confirmText || "Ja"}</Text>
          </Pressable>
        </View>
      )}
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

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },

  toastConfirm: {
    borderRadius: 24,
    minWidth: 290,
    paddingVertical: 16,
    paddingHorizontal: 18,
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
    textAlign: "center",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 14,
  },

  cancelButton: {
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  confirmButton: {
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  cancelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  confirmText: {
    color: "#204A78",
    fontSize: 14,
    fontWeight: "800",
  },
});
