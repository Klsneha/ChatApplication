import { MessageSquare } from "lucide-react"

export const NoChatContainer = () => {
  return (
    <div className="flex flex-1 justify-center items-center flex-col gap-6">
      <div
        className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
        group-hover:bg-primary/20 transition-colors"
      >
        <MessageSquare className="size-6 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mt-2">Welcome to Chatty!</h1>
      <p className="text-base-content/60">Select a conversation from the sidebar to start chatting</p>
    </div>
  )
}
