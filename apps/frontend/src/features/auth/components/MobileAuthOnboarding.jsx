import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, X, Building2, User, Wrench } from "lucide-react";
import LoginForm from "./LoginForm";
import SocialSignupOptions from "./SocialSignupOptions";
import { ROUTES } from "../../../routes/routePaths";

export default function MobileAuthOnboarding({ initialMode = "signin", signupRole = null, initialDrawerOpen = false }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialMode); // 'signin' | 'signup'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAuthDrawer, setShowAuthDrawer] = useState(initialDrawerOpen);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Trigger 1-second delay transition
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setShowAuthDrawer(true);
    }, 1000);
  };

  const handleRoleSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full min-h-screen bg-[#0d1222] flex items-center justify-center sm:py-6 sm:px-4 font-sans select-none overflow-x-hidden">
      
      {/* ── Mobile Application Viewport Container ── */}
      <div 
        className="w-full sm:max-w-[410px] h-screen sm:h-[840px] sm:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col justify-between p-6 sm:border-[8px] sm:border-[#1e2846] transition-all bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url('/screen/splash_screen.png')` }}
      >
        
        {/* Top Spacer / Status Header */}
        <div className="pt-2 flex justify-center">
          <div className="w-20 h-1.5 bg-white/20 rounded-full sm:block hidden" />
        </div>

        {/* ── Center Welcome Text ── */}
        <div className="my-auto text-center px-4 flex flex-col items-center justify-center transition-all duration-300">
          {activeTab === "signin" ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3 text-center drop-shadow-md animate-fade-in">
                Welcome Back!
              </h1>
              <p className="text-sm font-semibold text-white/80 text-center max-w-[260px] leading-relaxed drop-shadow-sm animate-fade-in">
                Enter personal details to your employee account
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3 text-center drop-shadow-md animate-fade-in">
                Welcome!
              </h1>
              <p className="text-sm font-semibold text-white/80 text-center max-w-[260px] leading-relaxed drop-shadow-sm animate-fade-in">
                Create an account to get started
              </p>
            </>
          )}

          {/* 1-Second Loading Delay Indicator */}
          {isTransitioning && (
            <div className="mt-6 flex flex-col items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 animate-pulse">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
              <span className="text-xs font-bold text-white tracking-wide">Opening {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}...</span>
            </div>
          )}
        </div>

        {/* ── Bottom Pill Tab Bar (Compact Mobile Proportions) ── */}
        <div className="w-full pb-3 sm:pb-2 flex justify-center">
          <div className="bg-[#18203c]/90 backdrop-blur-md p-1 rounded-[22px] border border-white/10 flex items-center shadow-xl w-full max-w-[300px] relative">
            
            {/* Sign In Button */}
            {activeTab === "signin" ? (
              <button
                type="button"
                onClick={() => handleTabClick("signin")}
                disabled={isTransitioning}
                className="text-white font-extrabold text-xs px-4 py-2.5 flex-1 text-center cursor-pointer transition-all hover:text-white/80"
              >
                Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleTabClick("signin")}
                disabled={isTransitioning}
                className="bg-white text-[#2a3eb1] rounded-[18px] px-4 py-2.5 text-xs font-extrabold shadow-md cursor-pointer flex-1 text-center transition-all active:scale-[0.97]"
              >
                Sign In
              </button>
            )}

            {/* Sign Up Button */}
            {activeTab === "signup" ? (
              <button
                type="button"
                onClick={() => handleTabClick("signup")}
                disabled={isTransitioning}
                className="text-white font-extrabold text-xs px-4 py-2.5 flex-1 text-center cursor-pointer transition-all hover:text-white/80"
              >
                Sign up
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleTabClick("signup")}
                disabled={isTransitioning}
                className="bg-white text-[#2a3eb1] rounded-[18px] px-4 py-2.5 text-xs font-extrabold shadow-md cursor-pointer flex-1 text-center transition-all active:scale-[0.97]"
              >
                Sign up
              </button>
            )}

          </div>
        </div>

        {/* ── Auth Bottom Sheet / Slide-Up Drawer ── */}
        <div 
          className={`absolute inset-x-0 bottom-0 max-h-[72%] sm:max-h-[70%] top-auto bg-white rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col transition-transform duration-500 ease-out ${
            showAuthDrawer ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Top Handle / Close Button */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60 rounded-t-[32px]">
            <button 
              onClick={() => {
                if (signupRole) {
                  navigate(ROUTES.SIGNUP);
                } else {
                  setShowAuthDrawer(false);
                }
              }}
              className="p-1.5 rounded-full hover:bg-gray-200/60 text-gray-600 transition-colors flex items-center gap-1 text-[11px] font-extrabold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
            <button 
              onClick={() => setShowAuthDrawer(false)}
              className="p-1.5 rounded-full hover:bg-gray-200/60 text-gray-400 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1">
            {activeTab === "signin" ? (
              <div className="w-full max-w-sm mx-auto">
                <LoginForm />
              </div>
            ) : signupRole ? (
              <div className="w-full max-w-sm mx-auto space-y-3 py-1">
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {signupRole} Registration
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">Create {signupRole.toLowerCase()} account</h2>
                  <p className="text-[11px] font-medium text-slate-500">Sign up using your phone or Google account</p>
                </div>
                <SocialSignupOptions role={signupRole} />
              </div>
            ) : (
              <div className="w-full max-w-sm mx-auto space-y-3 py-1">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Select Account Type</h2>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Choose how you want to register on the platform</p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => handleRoleSelect(ROUTES.SIGNUP_WORKER)}
                    className="w-full p-3 bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100/90 rounded-xl flex items-center gap-3 text-left transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">Register as Worker</h4>
                      <p className="text-[10px] font-medium text-slate-500">Find job opportunities and get hired</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect(ROUTES.SIGNUP_AGENCY)}
                    className="w-full p-3 bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-100/90 rounded-xl flex items-center gap-3 text-left transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">Register as Agency</h4>
                      <p className="text-[10px] font-medium text-slate-500">Manage workforce and assign contracts</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect(ROUTES.SIGNUP_CLIENT)}
                    className="w-full p-3 bg-blue-50/70 hover:bg-blue-50 border border-blue-100/90 rounded-xl flex items-center gap-3 text-left transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">Register as Client</h4>
                      <p className="text-[10px] font-medium text-slate-500">Hire workers and post job requirements</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
