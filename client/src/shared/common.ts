import axios from "axios";
import type { ApiError } from "./types";
import toast from "react-hot-toast";

export const notifyError = (error: unknown, isError: boolean) => {
  if (isError && axios.isAxiosError<ApiError>(error) && error?.response?.data?.message) {
    toast.error(error?.response?.data?.message);
  }
}