import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create your account — Career Navigator" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start plotting your career trajectory."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-signal-600 dark:text-signal-300">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
