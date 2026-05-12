import { API_URL } from "@/services/api";
import api from "./apiI";

export async function loginUser(email: string, password: string) {
  const body = { email, password };

  console.log("LOGIN REQUEST BODY:", body);

  try {
    const response = await api.post("/user/login", body);

    console.log("LOGIN RAW RESPONSE:", response);
    console.log("LOGIN RESPONSE DATA:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("LOGIN ERROR:", error);
    console.log("LOGIN ERROR RESPONSE:", error.response);

    throw new Error(
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Login failed"
    );
  }
}

// --------------------
// REGISTER
// --------------------
export async function registerUser(
  email: string,
  password: string,
  gender: string,
  dateOfBirth: string
) {
  const body = {
    email,
    password,
    gender,
    dateOfBirth,
  };

  console.log("REGISTER REQUEST BODY:", body);

  try {
    const response = await api.post("/user/register", body);

    console.log("REGISTER RAW RESPONSE:", response);
    console.log("REGISTER RESPONSE DATA:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("REGISTER ERROR:", error);
    console.log("REGISTER ERROR RESPONSE:", error.response);

    throw new Error(
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Register failed"
    );
  }
}
