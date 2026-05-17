import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WebSidebar from "@/components/navigation/WebSidebar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { colors, styles } from "@/styles/home.styles";

export default function ProfileScreen() {
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
          <ProfileContent />
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
        <ProfileContent mobile />
      </ScrollView>

      <MobileBottomNav />
    </SafeAreaView>
  );
}

function ProfileContent({ mobile = false }: { mobile?: boolean }) {
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
        Profile
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
        Here we will later show and edit user profile data like education,
        employment, age, gender and starting-form baseline values.
      </Text>
    </View>
  );
}
