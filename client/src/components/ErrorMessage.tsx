
import axios from "axios";
import type { ApiError, serverErrorProp } from "../shared/types";


export const ErrorMessage = ({error, isError}: serverErrorProp) => {
  
  return isError && axios.isAxiosError<ApiError>(error) ? 
    (
      <div className="alert alert-error">
        <span>{error?.response?.data?.message}</span>
      </div>
    ) : null;
};