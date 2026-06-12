"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Shield, Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Mode: sign-in or sign-up
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode with query parameter if present
  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
              username: username || email.split("@")[0],
            },
          },
        });

        if (error) throw error;

        // Note: Supabase might require email confirmation, or create session directly
        if (data?.session) {
          setSuccessMsg("Account created successfully! Redirecting...");
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1500);
        } else {
          setSuccessMsg("Check your email for the verification link!");
        }
      } else {
        // Sign In Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setSuccessMsg("Logged in successfully! Loading dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] z-10">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded bg-accent text-black flex items-center justify-center font-bold text-xl tracking-tighter">
          W
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          WE Go<span className="text-accent">!</span> Workspace
        </h2>
        <p className="text-xs text-neutral-500 font-mono">
          {isSignUp ? "CREATE NEW DEVELOPER PROFILE" : "ENTER SECURE DASHBOARD"}
        </p>
      </div>

      {/* Auth Box */}
      <div className="border border-border-custom rounded-lg bg-neutral-950/80 backdrop-blur-xl p-8">
        {errorMsg && (
          <div className="mb-5 p-3 rounded border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-mono text-center">
            Error: {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded border border-accent/20 bg-accent/5 text-xs text-accent font-mono text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {isSignUp && (
            <>
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-neutral-400" htmlFor="fullName">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    disabled={loading}
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-border-custom rounded text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-neutral-400" htmlFor="username">
                  USERNAME (OPTIONAL)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-600">@</span>
                  <input
                    id="username"
                    type="text"
                    disabled={loading}
                    placeholder="janedoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-neutral-900 border border-border-custom rounded text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-neutral-400" htmlFor="email">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-border-custom rounded text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-neutral-400" htmlFor="password">
                PASSWORD
              </label>
              {!isSignUp && (
                <Link
                  href="#"
                  className="text-[10px] font-mono text-neutral-500 hover:text-white transition-colors"
                >
                  FORGOT?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
              <input
                id="password"
                type="password"
                required
                disabled={loading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-border-custom rounded text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded bg-accent text-black font-semibold text-sm hover:opacity-90 active:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin stroke-[2.5]" />
            ) : isSignUp ? (
              "Create Developer Profile"
            ) : (
              "Access Dashboard"
            )}
          </button>
        </form>

        {/* Toggle Screen */}
        <div className="mt-6 pt-6 border-t border-border-custom text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-neutral-400 hover:text-white transition-colors font-mono"
          >
            {isSignUp
              ? "ALREADY HAVE AN ACCOUNT? SIGN IN"
              : "NEED AN ACCOUNT? CREATE A PROFILE"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 selection:bg-accent selection:text-black relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-xs font-mono text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Landings
      </Link>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-accent animate-spin stroke-[2.5]" />
            <span className="text-xs font-mono text-neutral-500 mt-4">LOADING SECURE SIGNIN...</span>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-600 mt-6 font-mono z-10">
        <Shield className="h-3.5 w-3.5" />
        <span>SSL SECURE &bull; DATA SAFEGUARDED BY SUPABASE RLS</span>
      </div>
    </div>
  );
}
