import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { authApi } from "../api/auth.api";
import { ROUTES } from "../../../routes/routePaths";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Setup React Query Mutation
  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response, variables) => {
      const { user, accessToken } = response.data.data;
      
      // Pass the user data into the AuthContext
      login(user, accessToken, variables.rememberMe);
      toast.success("Login successful!");
      
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Invalid email or password");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (data) => authApi.googleLogin(data),
    onSuccess: (response) => {
      const { user, accessToken, isNewUser } = response.data.data;
      
      // If the backend indicates it's a completely new user who needs a role
      if (isNewUser && user.profileType === "PENDING_ROLE") {
        login(user, accessToken, false);
        toast.success("Please select your account type to continue.");
        navigate(ROUTES.ROLE_SELECTION || "/role-selection"); // fallback if route doesn't exist yet
        return;
      }
      
      login(user, accessToken, false);
      toast.success("Login successful!");
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Google login failed");
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
    try {
      const { signInWithPopup } = await import("firebase/auth");
      const { auth, googleProvider } = await import("../../../config/firebase");
      
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      googleLoginMutation.mutate({ idToken });
    } catch (error) {
      console.error("Firebase Google Login Error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Failed to login with Google.");
      }
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm w-full">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4 pt-6">
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="name@example.com"
            disabled={loginMutation.isPending}
            autoComplete="email"
            autoFocus
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="space-y-1">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              disabled={loginMutation.isPending}
              autoComplete="current-password"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register("password")}
            />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register("rememberMe")}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                tabIndex={0}
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            fullWidth
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
          
          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            disabled={googleLoginMutation.isPending}
            onClick={handleGoogleLogin}
            className="relative bg-white text-gray-700 hover:bg-gray-50 border-gray-300 h-10"
          >
            {googleLoginMutation.isPending ? (
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.78 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.47 18.63 12 18.63C9.16 18.63 6.75 16.71 5.88 14.15H2.21V16.99C4.01 20.57 7.71 23 12 23Z" fill="#34A853"/>
                <path d="M5.88 14.15C5.66 13.49 5.54 12.77 5.54 12C5.54 11.23 5.66 10.51 5.88 9.85V7.01H2.21C1.47 8.49 1.05 10.18 1.05 12C1.05 13.82 1.47 15.51 2.21 16.99L5.88 14.15Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.35 3.87C17.45 2.1 14.97 1 12 1C7.71 1 4.01 3.43 2.21 7.01L5.88 9.85C6.75 7.29 9.16 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
            )}
            Google
          </Button>

          <div className="text-sm text-center text-gray-500 mt-2">
            Don't have an account?{" "}
            <Link to={ROUTES.SIGNUP} className="text-blue-600 font-medium hover:underline">
              Sign up here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
