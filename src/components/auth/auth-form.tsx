"use client";

import * as React from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AuthAction, AuthActionState } from "@/lib/auth-actions";

type AuthFormProps = {
  mode: "login" | "signup";
  action: AuthAction;
};

const initialState: AuthActionState = {
  error: null,
  message: null,
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Working..." : label}
    </Button>
  );
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = React.useActionState(action, initialState);
  const isLogin = mode === "login";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? "Welcome back" : "Create your account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Sign in with your email and password."
            : "Use your email and a secure password to sign up."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.error ? (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}
        {state.message ? (
          <Alert>
            <AlertTitle>Check your inbox</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        ) : null}
        <form action={formAction} className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@studio.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="********"
              required
            />
            {isLogin ? (
              <div className="flex justify-end">
                <Link className="text-xs text-muted-foreground underline" href="/forgot-password">
                  Forgot password?
                </Link>
              </div>
            ) : null}
          </div>
          <SubmitButton label={isLogin ? "Sign in" : "Sign up"} />
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "New to ModTV? " : "Already have an account? "}
          <Link className="font-medium text-foreground underline" href={isLogin ? "/signup" : "/login"}>
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
