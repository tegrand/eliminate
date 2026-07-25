import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { authApi } from "../api/auth.api";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

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
    },
  });

  // Setup React Query Mutation
  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response) => {
      // Pass the user data into the AuthContext
      login(response.data.user);
      toast.success("Login successful!");
      navigate("/dashboard");
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
              type="password"
              id="password"
              placeholder="••••••••"
              disabled={loginMutation.isPending}
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex justify-end pt-1">
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                tabIndex={0}
              >
                Forgot password?
              </a>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            fullWidth
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
