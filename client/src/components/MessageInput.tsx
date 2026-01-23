import { Send, Image, X } from "lucide-react";
import { useState } from "react"
import { useSendMessageMutation } from "../api/message/queries";
import type { SendMessage } from "../shared/types";

type MessageInputProps = {
  userId: string;
    setImagePreviewOpen: (val: boolean) => void;
}

export const MessageInput = ({ userId, setImagePreviewOpen }: MessageInputProps) => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string>();

  const {
    mutate: sendMessage,
    // isError,
    // error
  } = useSendMessageMutation(userId);
  

  const onImageChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evt: ProgressEvent<FileReader>) => {
      const base64EncodedImage = evt.target?.result as string;
      setImage(base64EncodedImage);
      setImagePreviewOpen(true);
    }
  }

  const onTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setText(evt.target.value);
  }

  const OnSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const payload: SendMessage= {
      ...(text && { text }),
      ...(image && { image }),
      userId
    }
    sendMessage(payload);
    setText("");
    setImage(undefined);
    setImagePreviewOpen(false);
  }

  const removeImage = () => {
    setImage(undefined);
    setImagePreviewOpen(false);
  }

  return (
    <div className="flex flex-col">
      {image ? 
        <div className="relative w-33 h-33 mb-2">
          <img 
            src={image}
            className="w-32 h-32 object-cover rounded-md bottom-0 right-0"
          />
          <button
            className="absolute top-0.5 right-0.5 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
            onClick={removeImage}
          >
            <X className="size-4"/>
          </button>
          
        </div> : null
      }
      <div className="flex-1">
        <form onSubmit={OnSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Type a message..."
            value={text}
            onChange={onTextChange}
          />
          <label className="flex flex-col justify-center items-center">
            <Image className="cursor-pointer"/>
            <input 
              type="file" 
              onChange={onImageChange}
              className={"hidden"}
            />
          </label>
          <button
            type="submit"
          >
            <Send />
          </button> 
        </div>  
      </form>
    </div>   
  </div>
  )
}
