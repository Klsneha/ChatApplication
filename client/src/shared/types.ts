export type UserDetails = {
  fullName: string;
  password: string;
  email: string;
}

export type FormError = Partial<UserDetails>;
export type LoginUserDetails = Omit<UserDetails, "fullName">;

export type serverErrorProp = {
  error?: unknown;
  isError: boolean;
}

export type ApiError = { message?: string };

export type User = {
  email: string,
  fullName: string,
  profilePic: {
    imageUrl: string,
    imageId: string,
  }
  _id: string,
  createdAt: string,
  updatedAt: string
}

export type Message = {
  senderId: string,
  receivedId: string,
  text: string,
  image: string,
  createdAt: string,
  updatedAt: string,
  _id: string
}

export type SendMessage = {
  text?: string, 
  image?: string,
  userId: string;
}
