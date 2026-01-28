import { BaseLayout } from "@/components/base-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { signUpAction } from "@/lib/auth-actions";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <BaseLayout className="flex items-center">
      <div className="mx-auto w-full max-w-md">
        <AuthForm mode="signup" action={signUpAction} />
      </div>
    </BaseLayout>
  );
}
