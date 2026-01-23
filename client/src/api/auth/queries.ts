import { useMutation, useQuery } from "@tanstack/react-query";
import { login, logout, signUp, updateProfile, verifyAuth } from "./api";
import type { LoginUserDetails, UserDetails } from "../../shared/types";
import toast from "react-hot-toast";
import { queryClient } from "../../main";

export function useCheckAuthQuery() {
  return useQuery({
    queryKey: ["checkAuth"],
    queryFn: verifyAuth,
    retry: false,
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (payload: UserDetails) => signUp(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["checkAuth"] });
      toast.success(res.data.message);
    },
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logout,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["checkAuth"] });
      toast.success(res.data.message)
    },
  })
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginUserDetails) => login(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["checkAuth"] });
      toast.success(res.data.message);

    },
  });
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (obj: { ["profilePic"]: string }) => updateProfile(obj),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkAuth"] });
      // toast.success(res.data.message)
    },
  });
}







