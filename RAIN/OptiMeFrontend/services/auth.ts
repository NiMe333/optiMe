import { API_URL } from "@/services/api";
import api from "./apiI";

import {
  saveAccessToken,
  getAccessToken
} from "@/services/authStorage";

export async function loginUser(
  email: string,
  password: string
) {
  try {
    const response = await api.post(
      "/user/login",
      {
        email,
        password,
      }
    );

    const accessToken =
      response.data.accessToken;

    await saveAccessToken(
      accessToken
    );
    console.log("saved token", accessToken);
    console.log("token from storage", await getAccessToken());

    return response.data;

  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      "Login failed"
    );
  }
}


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
    const response = await api.post(
      "/user/register",
      body
    );

    console.log(
      "REGISTER RESPONSE DATA:",
      response.data
    );

    if (response.data.accessToken) {
      await saveAccessToken(
        response.data.accessToken
      );
    }

    return response.data;

  } catch (error: any) {
    console.log("REGISTER ERROR:", error);

    console.log(
      "REGISTER ERROR RESPONSE:",
      error.response
    );

    throw new Error(
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Register failed"
    );
  }
}

export async function submitStartingForm(
  answers: any
) {
  console.log("FORM DATA:", answers);

  try {
    const response = await api.post(
      "/user/startingForm",
      answers
    );

    console.log(
      "FORM RAW RESPONSE:",
      response
    );

    console.log(
      "FORM RESPONSE DATA:",
      response.data
    );

    if (response.data.accessToken) {
      await saveAccessToken(
        response.data.accessToken
      );
    }

    return response.data;

  } catch (error: any) {
    console.log("FORM ERROR:", error);

    console.log(
      "FORM ERROR RESPONSE:",
      error.response
    );

    throw new Error(
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Form submission failed"
    );
  }
}
