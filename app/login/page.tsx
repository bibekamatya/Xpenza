import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Clock } from "lucide-react";
import Image from "next/image";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-blue-500/20 ring-1 ring-blue-400/10">
          {/* Header */}
          <div className="px-8 py-6 md:py-3 text-center relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-purple-600/10 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent"></div>
            
            <div className="relative">
              <div className="w-44 h-44 md:w-36 md:h-36 mx-auto mb-2 md:mb-1 relative">
                <Image
                  src="/logo.png"
                  alt="Xpenza"
                  width={176}
                  height={176}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
              <p className="text-slate-300 text-xs font-medium">Smart financial management made simple</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-5">
            <div className="text-center mb-6 md:mb-5">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-300 text-sm">Sign in to continue</p>
            </div>

            {/* Features */}
            <div className="space-y-2.5 mb-6 md:mb-5">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-blue-700/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm">Track income and expenses</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600/20 to-green-700/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm">Visualize your spending</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-purple-700/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm">Stay on budget</span>
              </div>
            </div>

            {/* Sign In Button */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 md:py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] shadow-lg shadow-blue-900/60 hover:shadow-xl hover:shadow-blue-800/70 flex items-center justify-center gap-3 border border-blue-400/30"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              By signing in, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Xpenza. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
