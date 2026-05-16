import { Image, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WebSidebar() {
  return (
    <View style={styles.sidebar}>
      <View style={styles.top}>
        <Image
          source={require("@/assets/images/just_circle.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.center}>
        <Pressable style={styles.activeItem}>
          <Ionicons name="home" size={24} color="#fff" />
        </Pressable>

        <Pressable style={styles.item}>
          <Ionicons name="stats-chart-outline" size={27} color="#183F68" />
        </Pressable>

        <Pressable style={styles.item}>
          <Ionicons name="heart-outline" size={28} color="#183F68" />
        </Pressable>

        <Pressable style={styles.item}>
          <Ionicons name="person-outline" size={28} color="#183F68" />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <Pressable style={styles.item}>
          <Ionicons name="settings-outline" size={25} color="#183F68" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 92,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    paddingVertical: 28,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  top: {
    alignItems: "center",
  },

  logo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 34,
  },

  bottom: {
    alignItems: "center",
  },

  activeItem: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#183F68",
    alignItems: "center",
    justifyContent: "center",
  },

  item: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
