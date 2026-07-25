import ResetPasswordHeader from "../components/ResetPasswordHeader";
import ResetPasswordForm from "../components/ResetPasswordForm";
import ResetPasswordFooter from "../components/ResetPasswordFooter";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50/50">
      <div className="w-full max-w-[420px] flex flex-col items-center space-y-8">
        <ResetPasswordHeader />
        <ResetPasswordForm />
        <ResetPasswordFooter />
      </div>
    </div>
  );
}
