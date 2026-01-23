import { Camera, Mail, User } from "lucide-react"
import { useEffect, useState } from "react";
import { useCheckAuthQuery, useUpdateProfileMutation } from "../api/auth/queries";

export const ProfilePage = () => {

  const { data: user } = useCheckAuthQuery();

  const userDetails = user?.data;

  const [image, setSelectedImage] = useState<string>();

  useEffect(() => {
    if (userDetails.profilePic)  {
      setSelectedImage(prev => !prev ? userDetails.profilePic?.imageUrl : prev);
    }
  }, [userDetails.profilePic]);


  const {
  mutate: updateProfile,
  // isPending,
  // isError,
  // error,
  } = useUpdateProfileMutation();

  const onImageChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evt: ProgressEvent<FileReader>) => {
      const base64EncodedImage = evt.target?.result as string;
      setSelectedImage(base64EncodedImage)
      updateProfile({ profilePic: base64EncodedImage });
    }
  }

  return (
     <div className="min-h-screen flex flex-col justify-center items-center p-10 lg:p-12 border-2">
      <div className="mx-auto w-full max-w-xl px-4 space-y-8 border-2 bg-base-300">
        <div className="text-center m-8">
          <h1 className="text-2xl font-semibold mt-2">Profile</h1>
          <p className="text-base-content/60">Your Profile Information</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <img 
            src={image ?? "/avatar.png"}
            className="size-32 rounded-full object-cover"
          />
          <label 
            className="flex flex-col justify-center items-center">
            <Camera />
            <input 
              type="file" 
              onChange={onImageChange}
              className={"hidden"}
            />
          </label>
        </div>
        <fieldset className="bg-base-200 border-base-300 rounded-box p-6 rounded-lg space-y-4">
          <div className="form-control">
            <label className="label">
              <User className="size-5 text-base-content/40"/>
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered w-full bg-base-300 border-2"
              placeholder="Enter Email"
              value={userDetails?.fullName}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <Mail className="size-5 text-base-content/40"/>
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered w-full bg-base-300 border-2"
              placeholder="Enter Email"
              value={userDetails?.email}
            />
          </div>

        </fieldset>
        <fieldset className="mt-6 bg-base-200 border-base-300 rounded-box p-6 rounded-lg space-y-4">
          <h2 className="text-lg font-medium  mb-4">Account Information </h2>
          <div className="flex items-center justify-between border-b border-zinc-700">
            <span>Member Since</span>
           <span>{userDetails?.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-500">Active</span>
          </div>
        </fieldset>
      </div>
    </div>
  )
}
