import { Redirect } from "expo-router";
import usePedometer from "@/hooks/usePedometer";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, authLoading } = useAuth();
  usePedometer();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  if (user.formFinished === true) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/user/startingForm" />;
}
