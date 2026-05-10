import { API_URL } from "./api";

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function registerUser(
  email: string,
  password: string,
  gender: string,
  dateOfBirth: string,
) {
  const response = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      gender,
      dateOfBirth,
    }),
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.log("Server did not return JSON:", text);
    throw new Error("Server did not return JSON.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Register failed");
  }

  return data;
}
