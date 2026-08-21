import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import { Eye, EyeOff, Phone, Mail } from "lucide-react";

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
  const { login, loginWithGoogle, requestOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleRoleRedirect = (user) => {
      if (user.role === "SUPER_ADMIN") {
        navigate(ROUTES.DASHBOARD);
      } else if (user.role === "CLIENT") {
        navigate(ROUTES.DASHBOARD); 
      } else if (user.role === "AGENCY") {
        navigate(ROUTES.DASHBOARD);
      } else if (user.role === "WORKER") {
        navigate(ROUTES.DASHBOARD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
  };

  // Setup React Query Mutation
  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response, variables) => {
      const { user, accessToken } = response.data.data;
      login(user, accessToken, variables.rememberMe);
      toast.success("Login successful!");
      handleRoleRedirect(user);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Invalid email or password");
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      // Normally here you'd send result.user.accessToken to backend to exchange for custom token
      // For demonstration, we just mock the login if backend is not setup for firebase yet.
      // login(result.user, result.user.accessToken); 
      toast.success("Google login successful!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) return toast.error("Please enter a phone number");
    try {
      setLoading(true);
      await requestOTP(phoneNumber);
      setOtpSent(true);
      toast.success("OTP sent!");
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Please enter OTP");
    try {
      setLoading(true);
      const result = await verifyOTP(otp);
      toast.success("Phone login successful!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm w-full">
      {loginMethod === 'email' ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4 pt-6">
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="name@example.com"
              disabled={loginMutation.isPending || loading}
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
                disabled={loginMutation.isPending || loading}
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
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button type="button" variant="outline" onClick={() => setLoginMethod('phone')} disabled={loading}>
                <Phone className="w-4 h-4 mr-2" /> Phone Number
              </Button>
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
      ) : (
        <div className="space-y-4 pt-6 p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Sign in with Phone</h3>
            <p className="text-sm text-gray-500">Enter your phone number to receive an OTP.</p>
          </div>
          
          {!otpSent ? (
            <div className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
              />
              <div id="recaptcha-container"></div>
              <Button fullWidth onClick={handleSendOTP} loading={loading}>
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="OTP"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
              <Button fullWidth onClick={handleVerifyOTP} loading={loading}>
                Verify OTP
              </Button>
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => { setLoginMethod('email'); setOtpSent(false); }} disabled={loading}>
              <Mail className="w-4 h-4 mr-2" /> Back to Email
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
