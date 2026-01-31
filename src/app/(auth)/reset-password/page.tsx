import { BaseLayout } from "@/components/base-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <BaseLayout className="flex items-center">
      <div className="mx-auto w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </BaseLayout>
  );
}
