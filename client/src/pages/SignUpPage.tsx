import { Mail, MessageSquare, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react";
import { Link } from "react-router-dom";
import type { FormError, UserDetails } from "../shared/types";
import { useSignUpMutation } from "../api/auth/queries";
import { EMAIL_REGEX } from "../shared/constants";
import { ValidatorError } from "../components/ValidatorError";
import { ErrorMessage } from "../components/ErrorMessage";

export const SignUpPage = () => {

  const [showPassowd, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData ] = useState<UserDetails>({
    fullName: "",
    email: "",
    password: ""
  });

  const [formError, setFormError] = useState<FormError>();

  const {
  mutate: signUp,
  isPending,
  isError,
  error,
  } = useSignUpMutation();

  const validator = (): FormError => {
    const error: FormError = {};
    
    const { fullName, email, password } = formData;
    if (!fullName.trim()) 
      error.fullName = "Full Name is required";

    if (!email?.trim()) 
      error.email = "Email is required";

    if (!EMAIL_REGEX.test(email.trim()))
      error.email = "Invalid email";
    
    if(!password?.trim()) 
      error.password = "Password is required";

    if (password.length < 4) {
      error.password = "Password must be atleast 4 characters";
    }

    if (Object.keys(error)?.length > 0) {
      setFormError(error);
    }
    return error;
  }

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const error = validator();
    console.log("error", error);
    if (!(Object.keys(error)?.length > 0)) {
      signUp(formData);
    }
  }

  const onFullNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({...prev, fullName: evt.target.value }));
  }

  const onEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({...prev, email: evt.target.value }));
  }

  const onPasswordChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({...prev, password: evt.target.value }));
  }

  const onShowPasswordClick = () => {
    setShowPassword(prev => !prev);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 lg:p-12 border-2">
      <div className="mx-auto w-full max-w-xl px-4 space-y-8 border-2">
          {/* LOGO */}
          <div className="text-center m-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">Get started with your free account</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
                <User className="size-5 text-base-content/40"/>
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="Enter User Name"
                value={formData.fullName}
                onChange={onFullNameChange}
              />
            </div>
            <ValidatorError error={formError?.fullName}/>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
                <Mail className="size-5 text-base-content/40"/>
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="Enter Email"
                value={formData.email}
                onChange={onEmailChange}
              />
            </div>
            <ValidatorError error={formError?.email}/>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="size-5 text-base-content/40"/>
              </div>
              <input
                type={showPassowd ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="Enter Password"
                value={formData.password}
                onChange={onPasswordChange}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10"
                onClick={onShowPasswordClick}
                type="button"
              >
                {showPassowd ? <EyeOff className="size-5 text-base-content/40"/> : <Eye className="size-5 text-base-content/40"/>}
              </button>
            </div>
            <ValidatorError error={formError?.password}/>
          </div>
          <ErrorMessage error={error} isError={isError} />
          <button 
            type="submit"
            className="btn btn-primary w-full"
          >
            {isPending ? 
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </> :
              <>
                Create Account
              </>
            }
          </button>
        </form>
        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>  
  );
}
