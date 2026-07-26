import ForgotPasswordHeader from "../components/ForgotPasswordHeader";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ForgotPasswordFooter from "../components/ForgotPasswordFooter";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50/50">
      <div className="w-full max-w-[420px] flex flex-col items-center space-y-8">
        <ForgotPasswordHeader />
        <ForgotPasswordForm />
        <ForgotPasswordFooter />
      </div>
    </div>
  );
}
