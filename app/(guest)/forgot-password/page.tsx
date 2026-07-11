'use client'
import ForgotPassword from "@/components/auth/Forgot-Password";
import { ForgotPassword as forgotPasswordRequest } from "@/api/requests";


const ForgotPasswordPage = () => {
  return <ForgotPassword onSubmit={async ({ email }) => {
        await forgotPasswordRequest(email);
      }}/>;
};

export default ForgotPasswordPage;