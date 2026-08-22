import { useState } from "react";
import { Phone, Mail, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Select from "../../../components/ui/select/Select";
import { useAuth } from "../../../hooks/useAuth";
import { authApi } from "../api/auth.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";

export default function SocialSignupOptions({ role }) {
  const { login, loginWithGoogle, requestOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [signupMethod, setSignupMethod] = useState("social"); // 'social' or 'phone'
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleRedirect = () => {
      navigate(ROUTES.DASHBOARD);
  };

  const handleGoogleSignup = async () => {
    if (!fullName.trim()) return toast.error("Please enter your name first");
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      
      const response = await authApi.socialLogin({
        token: result.user.accessToken,
        role,
        name: fullName,
      });

      login(response.data.data.user, response.data.data.accessToken);
      
      toast.success(`Welcome back!`);
      handleRoleRedirect();
    } catch (error) {
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!fullName.trim()) return toast.error("Please enter your name first");
    if (!phoneNumber) return toast.error("Please enter a phone number");
    
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('+')) {
      // If user typed the country code manually, use it
    } else {
      formattedPhone = `${countryCode}${formattedPhone}`;
    }

    try {
      setLoading(true);
      await requestOTP(formattedPhone);
      setOtpSent(true);
      toast.success("OTP sent!");
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(error?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Please enter OTP");
    try {
      setLoading(true);
      const result = await verifyOTP(otp);
      
      const response = await authApi.socialLogin({
        token: result.user.accessToken,
        role,
        name: fullName,
      });

      login(response.data.data.user, response.data.data.accessToken);

      toast.success(`Welcome back!`);
      handleRoleRedirect();
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (signupMethod === 'phone') {
    return (
        <div className="space-y-4 w-full animate-fade-in mt-2">
          
          {!otpSent ? (
            <div className="space-y-4">
              <Input
                label="Full Name / Agency Name"
                type="text"
                placeholder="e.g. Rahul Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex gap-2">
                  <div className="w-[35%]">
                    <Select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={loading}
                      options={[
                        { value: "+91", label: "🇮🇳 +91 (IN)" },
                        { value: "+1", label: "🇺🇸 +1 (US/CA)" },
                        { value: "+44", label: "🇬🇧 +44 (UK)" },
                        { value: "+971", label: "🇦🇪 +971 (AE)" },
                        { value: "+966", label: "🇸🇦 +966 (SA)" },
                        { value: "+61", label: "🇦🇺 +61 (AU)" },
                      ]}
                    />
                  </div>
                  <div className="w-[65%]">
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              <Button fullWidth onClick={handleSendOTP} loading={loading} type="button" className="bg-gray-900 hover:bg-gray-800">
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
              <Button fullWidth onClick={handleVerifyOTP} loading={loading} type="button" className="bg-gray-900 hover:bg-gray-800">
                Verify OTP
              </Button>
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => { setSignupMethod('social'); setOtpSent(false); }} disabled={loading} type="button">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>
    );
  }

  return (
    <div className="w-full space-y-5">
        <Input
          label="Full Name / Agency Name"
          type="text"
          placeholder="e.g. Rahul Kumar"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-3 mt-6">
            <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleSignup} 
                disabled={loading} 
                className="w-full text-xs sm:text-sm"
                leftIcon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                }
            >
                Google
            </Button>
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSignupMethod('phone')} 
                disabled={loading} 
                className="w-full text-xs sm:text-sm"
                leftIcon={<Phone className="w-4 h-4" />}
            >
                Phone
            </Button>
        </div>
    </div>
  );
}
