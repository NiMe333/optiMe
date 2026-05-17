import api from "@/services/apiI";
import { mockHomeData } from "@/data/mockHomeData";
import type { HomeDashboardData } from "@/types/home";

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  try {
    const response = await api.get("/home");

    if (response.data?.homeData) {
      return response.data.homeData;
    }

    if (response.data) {
      return response.data;
    }

    return mockHomeData;
  } catch (error) {
    return mockHomeData;
  }
}
