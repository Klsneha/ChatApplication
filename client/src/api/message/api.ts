import type { SendMessage } from "../../shared/types";
import { axiosInstance } from "../axios";

export const getUsers = async () => {
  const res = await axiosInstance.get("/message/users");
  return res?.data;
}

export const getMessages = async (userId: string) => {
  const res = await axiosInstance.get(`/message/${userId}`);
  return res?.data;
}


export const sendMessage = async (payload: SendMessage) => {
  const res = await axiosInstance.post(`/message/send/${payload.userId}`, payload);
  return res?.data;
}
