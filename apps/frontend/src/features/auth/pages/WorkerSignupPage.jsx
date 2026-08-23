import MobileAuthOnboarding from "../components/MobileAuthOnboarding";

export default function WorkerSignupPage() {
  return <MobileAuthOnboarding initialMode="signup" signupRole="WORKER" initialDrawerOpen={true} />;
}
