import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Log in — Career Navigator" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue where you left off."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-signal-600 dark:text-signal-300">
            Create an account
          </Link>
        </>
      }
    >
      {/* useSearchParams requires a Suspense boundary in the app router */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
