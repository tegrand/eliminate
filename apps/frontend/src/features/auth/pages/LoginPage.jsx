import LoginHeader from "../components/LoginHeader";
import LoginForm from "../components/LoginForm";
import LoginFooter from "../components/LoginFooter";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50/50">
      <div className="w-full max-w-[420px] flex flex-col items-center space-y-8">
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </div>
    </div>
  );
}
