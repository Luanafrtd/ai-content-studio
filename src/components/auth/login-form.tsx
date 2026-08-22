"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_EMAIL = "demo@quill.app";
const DEMO_PASSWORD = "demo1234";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signInWith = async (email: string, password: string) => {
    setFormError(null);
    const result = await signIn("credentials", { email, password, redirect: false });

    if (!result || result.error) {
      setFormError("Invalid email or password. Please try again.");
      return;
    }

    router.push(callbackUrl);
  };

  const onSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    try {
      await signInWith(values.email, values.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tryDemo = async () => {
    setIsDemoLoading(true);
    try {
      await signInWith(DEMO_EMAIL, DEMO_PASSWORD);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const busy = isSubmitting || isDemoLoading;

  return (
    <div className="w-full max-w-sm space-y-6">
      <Button type="button" className="w-full" onClick={tryDemo} disabled={busy}>
        {isDemoLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="size-4" aria-hidden="true" />
        )}
        Try the demo (one click)
      </Button>
      <p className="text-muted-foreground text-center text-xs">
        Signs you in instantly to a workspace preloaded with sample projects and generations.
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or sign in</span>
        </div>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        aria-describedby={formError ? "login-form-error" : undefined}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" role="alert" className="text-destructive text-sm">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password ? (
            <p id="password-error" role="alert" className="text-destructive text-sm">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p
            id="login-form-error"
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {formError}
          </p>
        ) : null}

        <Button type="submit" variant="outline" className="w-full" disabled={busy}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Sign in
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-foreground font-medium underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}
