import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Card className="border-gray-200 shadow-sm w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              id="new-password"
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="new-password"
              autoFocus
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none focus:text-blue-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none focus:text-blue-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Reset Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
