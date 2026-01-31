import { BaseLayout } from "@/components/base-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <BaseLayout className="flex items-center">
      <div className="mx-auto w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </BaseLayout>
  );
}
