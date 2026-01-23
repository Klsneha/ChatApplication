import axios from "axios";
import type { LoginUserDetails, UserDetails } from "../../shared/types";
import { axiosInstance } from "../axios"

export const verifyAuth = async () => {
  try {
    const res = await axiosInstance.get("/auth/check");
    return res;

  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return null; // ✅ logged out
    } else {
      throw err;
    }
  }
}

export const signUp = async (payload: UserDetails) => {
  const res = await axiosInstance.post("/auth/signup", payload);
  return res;
}

export const login = async (payload: LoginUserDetails) => {
  const res = await axiosInstance.post("/auth/login", payload);
  return res;
}

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res;
}

export const updateProfile = async (obj: { ["profilePic"]: string }) => {
  const res = await axiosInstance.put("/auth/updateProfile", obj);
  return res;
}