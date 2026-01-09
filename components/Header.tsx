"use client";
import Image from "next/image";
import { handleSignOut } from "@/app/actions/authActions";
import { DollarSign, LogOut } from "lucide-react";

interface HeaderProps {
  user: { image: string; email: string; name: string };
}

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  height={40}
                  width={40}
                  className="rounded-lg"
                />
              ) : (
                <DollarSign className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Expense Tracker</h1>
              <p className="text-xs text-slate-400">
                {user?.name || user?.email}
              </p>
            </div>
          </div>

          <form action={handleSignOut}>
            <button
              type="submit"
              className="p-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-full transition-all active:scale-95 border border-red-600/30"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
