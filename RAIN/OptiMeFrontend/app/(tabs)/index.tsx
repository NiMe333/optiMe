import { Redirect } from "expo-router";
import usePedometer from "@/hooks/usePedometer";

export default function Index() {
  const isLoggedIn = false;
  usePedometer();

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
