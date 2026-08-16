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

  const onSubmit = (data) => {
    loginMutation.mutate(data);
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
