import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";

export default function SocialSignupOptions({ role }) {
  const { login, loginWithGoogle, requestOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [signupMethod, setSignupMethod] = useState("social"); // 'social' or 'phone'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleRedirect = () => {
      navigate(ROUTES.DASHBOARD);
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      // TODO: Call your backend API here e.g. authApi.registerSocial({ token: result.user.accessToken, role })
      toast.success(`Google signup successful for ${role}!`);
      handleRoleRedirect();
    } catch (error) {
      toast.error("Google signup failed");
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
      // TODO: Call your backend API here e.g. authApi.registerSocial({ token: result.user.accessToken, role })
      toast.success(`Phone signup successful for ${role}!`);
      handleRoleRedirect();
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (signupMethod === 'phone') {
    return (
        <div className="space-y-4 py-4 w-full animate-fade-in border-t border-gray-100 mt-6 pt-6">
          <div className="text-center mb-4">
            <h3 className="text-sm font-medium">Sign up with Phone</h3>
            <p className="text-xs text-gray-500">Enter your phone number to receive an OTP.</p>
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
              <Button fullWidth onClick={handleSendOTP} loading={loading} type="button">
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
              <Button fullWidth onClick={handleVerifyOTP} loading={loading} type="button">
                Verify OTP
              </Button>
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => { setSignupMethod('social'); setOtpSent(false); }} disabled={loading} type="button">
              <Mail className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>
    );
  }

  return (
    <div className="w-full">
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or quickly sign up with</span>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <Button type="button" variant="outline" onClick={handleGoogleSignup} disabled={loading}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
            </Button>
            <Button type="button" variant="outline" onClick={() => setSignupMethod('phone')} disabled={loading}>
            <Phone className="w-4 h-4 mr-2" /> Phone Number
            </Button>
        </div>
    </div>
  );
}
