import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WebSidebar from "@/components/navigation/WebSidebar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { colors, styles } from "@/styles/home.styles";

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const isWebLayout = width >= 1000;

  if (isWebLayout) {
    return (
      <View style={styles.webRoot}>
        <View style={styles.webSidebarShell}>
          <WebSidebar />
        </View>

        <ScrollView
          style={styles.webContent}
          contentContainerStyle={styles.webContentInner}
          showsVerticalScrollIndicator={false}
        >
          <SettingsContent />
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mobileRoot} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mobileContent}
      >
        <SettingsContent mobile />
      </ScrollView>

      <MobileBottomNav />
    </SafeAreaView>
  );
}

function SettingsContent({ mobile = false }: { mobile?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: mobile ? 22 : 24,
        borderWidth: 1,
        borderColor: colors.border,
        padding: mobile ? 18 : 24,
        minHeight: 260,
      }}
    >
      <Text
        style={{
          color: colors.navy,
          fontSize: mobile ? 24 : 30,
          fontWeight: "900",
        }}
      >
        Settings
      </Text>

      <Text
        style={{
          color: colors.textSoft,
          fontSize: 14,
          fontWeight: "700",
          marginTop: 8,
          lineHeight: 21,
        }}
      >
        Here we will later add account settings, notifications, privacy,
        reminders and logout options.
      </Text>
    </View>
  );
}
