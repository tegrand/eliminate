import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { ROUTES } from "../../../routes/routePaths";

export default function ForgotPasswordForm() {
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
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Send Reset Link
          </Button>
          <Link 
            to={ROUTES.LOGIN} 
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
