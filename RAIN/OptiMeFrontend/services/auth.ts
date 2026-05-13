import api, { publicApi } from "./apiI";

import {
  saveAccessToken,
  getAccessToken,
  deleteAccessToken,
} from "@/services/authStorage";

export async function loginUser(email: string, password: string) {
  try {
    const response = await publicApi.post("/user/login", {
      email,
      password,
    });

    const accessToken = response.data?.accessToken;

    if (!accessToken) {
      throw new Error("Access token missing from login response");
    }

    await saveAccessToken(accessToken);

    console.log("saved token", accessToken);
    console.log("token from storage", await getAccessToken());

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed",
    );
  }
}

export async function registerUser(
  email: string,
  password: string,
  gender: string,
  dateOfBirth: string,
) {
  const body = {
    email,
    password,
    gender,
    dateOfBirth,
  };

  console.log("REGISTER REQUEST BODY:", body);

  try {
    const response = await publicApi.post("/user/register", body);

    console.log("REGISTER RESPONSE DATA:", response.data);

    if (response.data?.accessToken) {
      await saveAccessToken(response.data.accessToken);
    }

    return response.data;
  } catch (error: any) {
    console.log("REGISTER ERROR:", error);
    console.log("REGISTER ERROR RESPONSE:", error.response);

    throw new Error(
      error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Register failed",
    );
  }
}

export async function submitStartingForm(answers: any) {
  console.log("FORM DATA:", answers);

  try {
    const response = await api.post("/user/startingForm", answers);

    console.log("FORM RAW RESPONSE:", response);
    console.log("FORM RESPONSE DATA:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("FORM ERROR:", error);
    console.log("FORM ERROR RESPONSE:", error.response);

    throw new Error(
      error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Form submission failed",
    );
  }
}

export async function logoutUser() {
  try {
    await publicApi.post("/user/logout");
  } finally {
    await deleteAccessToken();
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to get current user",
    );
  }
}
