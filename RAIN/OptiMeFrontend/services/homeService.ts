import { mockHomeData } from "@/data/mockHomeData";
import type { HomeDashboardData } from "@/types/home";

const USE_MOCK_HOME_DATA = true;

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  if (USE_MOCK_HOME_DATA) {
    return mockHomeData;
  }

  try {
    const api = await import("@/services/apiI");
    const response = await api.default.get("/home");

    if (response.data?.homeData) {
      return response.data.homeData;
    }

    if (response.data) {
      return response.data;
    }

    return mockHomeData;
  } catch {
    return mockHomeData;
  }
}
