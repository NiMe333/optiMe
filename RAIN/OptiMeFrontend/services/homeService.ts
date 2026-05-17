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

    const homeData = response.data?.homeData ?? response.data;

    if (!homeData) {
      return mockHomeData;
    }

    return homeData;
  } catch (error) {
    console.log("Home data fetch failed, using mock data:", error);
    return mockHomeData;
  }
}
