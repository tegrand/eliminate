import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="border-gray-200 shadow-sm w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="name@example.com"
            required
            disabled={loading}
            autoComplete="email"
            autoFocus
          />
          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
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
            loading={loading}
          >
            Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
