import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type NavigationItem = {
  label: string;
  href: string;
  activePath: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

export const mainNavigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/home",
    activePath: "/home",
    icon: "home-outline",
  },
  {
    label: "Stats",
    href: "/home",
    activePath: "/home",
    icon: "stats-chart-outline",
  },
  {
    label: "Care",
    href: "/home",
    activePath: "/home",
    icon: "heart-outline",
  },
  {
    label: "Profile",
    href: "/user/profile",
    activePath: "/user/profile",
    icon: "person-outline",
  },
];

export const sidebarBottomNavigationItems: NavigationItem[] = [
  {
    label: "Settings",
    href: "/(tabs)/settings",
    activePath: "/settings",
    icon: "settings-outline",
  },
];
