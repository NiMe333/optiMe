import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WebSidebar() {
  return (
    <View style={styles.sidebar}>
      <Pressable style={styles.activeItem}>
        <Ionicons name="home" size={22} color="#fff" />
      </Pressable>

      <Pressable style={styles.item}>
        <Ionicons name="stats-chart-outline" size={26} color="#183F68" />
      </Pressable>

      <Pressable style={styles.item}>
        <Ionicons name="heart-outline" size={26} color="#183F68" />
      </Pressable>

      <Pressable style={styles.item}>
        <Ionicons name="person-outline" size={26} color="#183F68" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 92,
    backgroundColor: "#FFFFFF",
    margin: 18,
    borderRadius: 34,
    paddingVertical: 28,
    alignItems: "center",
    gap: 28,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },

  activeItem: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#183F68",
    alignItems: "center",
    justifyContent: "center",
  },

  item: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
});
