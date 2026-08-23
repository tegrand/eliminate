import MobileAuthOnboarding from "../components/MobileAuthOnboarding";

export default function AgencySignupPage() {
  return <MobileAuthOnboarding initialMode="signup" signupRole="AGENCY" initialDrawerOpen={true} />;
}
