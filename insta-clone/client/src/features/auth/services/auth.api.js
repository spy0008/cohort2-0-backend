import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register(username, email, password) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Register failed. Please try again.";
    return { success: false, error: message, status: error.response?.status };
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";
    return { success: false, error: message, status: error.response?.status };
  }
}

export async function getMe() {
  try {
    const response = await api.get("/get-me");

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Get me failed. Please try again.";
    return { success: false, error: message, status: error.response?.status };
  }
}
