import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import { Phone, ArrowLeft, Loader2, Sparkles, KeyRound, Globe } from "lucide-react";

import { ROUTES } from "../../../routes/routePaths";
import { authApi } from "../api/auth.api";

export default function LoginForm() {
  const { login, loginWithGoogle, requestOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("social"); // 'social' or 'phone'
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      
      const response = await authApi.socialLogin({
        token: result.user.accessToken,
      });

      const userObj = response.data.data.user;
      login(userObj, response.data.data.accessToken);

      toast.success("Google login successful!");
      if (userObj.status === "PENDING") {
        navigate(ROUTES.PENDING_APPROVAL);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) return toast.error("Please enter a phone number");
    
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `${countryCode}${formattedPhone}`;
    }

    try {
      setLoading(true);
      await requestOTP(formattedPhone);
      setOtpSent(true);
      toast.success("OTP sent to your phone number!");
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
      });

      const userObj = response.data.data.user;
      login(userObj, response.data.data.accessToken);

      toast.success("Phone login successful!");
      if (userObj.status === "PENDING") {
        navigate(ROUTES.PENDING_APPROVAL);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP or login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[11px] font-bold tracking-wide uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Secure Sign-In</span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h3>
        <p className="text-xs font-medium text-slate-500 mt-1">Select your preferred login method</p>
      </div>

      {/* Segmented Control Method Switcher */}
      <div className="bg-slate-100/90 p-1.5 rounded-2xl flex border border-slate-200/80 mb-6">
        <button
          type="button"
          onClick={() => { setLoginMethod("social"); setOtpSent(false); }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            loginMethod === "social"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Social Login</span>
        </button>

        <button
          type="button"
          onClick={() => setLoginMethod("phone")}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            loginMethod === "phone"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Phone OTP</span>
        </button>
      </div>

      {loginMethod === "social" ? (
        <div className="space-y-4">
          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
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
            )}
            <span>{loading ? "Authenticating..." : "Continue with Google"}</span>
          </button>

          {/* Quick Phone Switch */}
          <button
            type="button"
            onClick={() => setLoginMethod("phone")}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 border border-indigo-100 hover:border-indigo-200 text-indigo-700 font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-indigo-600" />
            <span>Continue with Phone Number</span>
          </button>

          <div className="text-center pt-3 border-t border-slate-100 mt-5">
            <p className="text-xs font-semibold text-slate-500">
              Don't have an account?{" "}
              <Link to={ROUTES.SIGNUP} className="text-indigo-600 font-extrabold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!otpSent ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Mobile Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={loading}
                    className="w-[38%] px-3 py-3 bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91 (IN)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+971">🇦🇪 +971 (AE)</option>
                    <option value="+966">🇸🇦 +966 (SA)</option>
                    <option value="+61">🇦🇺 +61 (AU)</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading}
                    className="w-[62%] px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm placeholder:text-slate-400 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>{loading ? "Sending OTP..." : "Get Verification Code"}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                  className="w-full text-center tracking-[0.5em] px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 font-extrabold text-lg placeholder:text-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
              </button>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => { setLoginMethod("social"); setOtpSent(false); }}
              disabled={loading}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Social Options</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
