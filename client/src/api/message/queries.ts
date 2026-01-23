import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, getUsers, sendMessage } from "./api";
import type { Message, SendMessage } from "../../shared/types";
import { queryClient } from "../../main";
import toast from "react-hot-toast";

export function useGetUsersQuery() {
  return useQuery({
    queryKey: ["usersList"],
    queryFn: getUsers,
    retry: false,
  });
}

export function useGetMessagesQuery(userId: string) {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: () => getMessages(userId),
    retry: false,
    enabled: !!userId,
  });
}

export function useSendMessageMutation(userId: string) {
  return useMutation({
    mutationFn: (payload: SendMessage) => sendMessage(payload),
    onSuccess: (res) => {
      console.log("*** res", res);
      // res.data is the newMessage object returned from your server
      const newMessage = res?.newMessage;

      // Manually update your own cache immediately
      queryClient.setQueryData(["messages", userId], (oldMessages: Message[]) => {
        return oldMessages ? [...oldMessages, newMessage] : [newMessage];
      });

      toast.success(res.data.message)
    }
  })
}

