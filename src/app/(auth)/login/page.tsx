import { BaseLayout } from "@/components/base-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { signInAction } from "@/lib/auth-actions";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <BaseLayout className="flex items-center">
      <div className="mx-auto w-full max-w-md">
        <AuthForm mode="login" action={signInAction} />
      </div>
    </BaseLayout>
  );
}
