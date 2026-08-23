import MobileAuthOnboarding from "../components/MobileAuthOnboarding";

export default function ClientSignupPage() {
  return <MobileAuthOnboarding initialMode="signup" signupRole="CLIENT" initialDrawerOpen={true} />;
}
