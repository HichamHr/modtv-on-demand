"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error: string | null;
  message: string | null;
};

export type AuthAction = (
  prevState: AuthActionState,
  formData: FormData
) => Promise<AuthActionState>;

const authSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const initialState: AuthActionState = {
  error: null,
  message: null,
};

function parseAuthForm(formData: FormData) {
  return authSchema.safeParse({
    email: typeof formData.get("email") === "string" ? formData.get("email") : "",
    password:
      typeof formData.get("password") === "string" ? formData.get("password") : "",
  });
}

function friendlyAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  return message;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = parseAuthForm(formData);

  if (!parsed.success) {
    return {
      ...initialState,
      error: parsed.error.errors[0]?.message ?? "Invalid form data.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ...initialState, error: friendlyAuthError(error.message) };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = parseAuthForm(formData);

  if (!parsed.success) {
    return {
      ...initialState,
      error: parsed.error.errors[0]?.message ?? "Invalid form data.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return { ...initialState, error: friendlyAuthError(error.message) };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    error: null,
    message: "Check your email for a confirmation link to finish signing up.",
  };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
