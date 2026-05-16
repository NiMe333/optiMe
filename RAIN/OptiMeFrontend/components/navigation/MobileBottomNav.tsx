import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MobileBottomNav() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.activeItem}>
        <Ionicons name="home" size={18} color="#fff" />
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
  container: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    height: 64,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  activeItem: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#183F68",
    alignItems: "center",
    justifyContent: "center",
  },

  item: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
