"use client";
import Image from "next/image";
import { handleSignOut } from "@/app/actions/authActions";
import { DollarSign, LogOut } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  user: { image: string; email: string; name: string };
}

const Header = ({ user }: HeaderProps) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <>
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  height={32}
                  width={32}
                  className="rounded-lg"
                />
              ) : (
                <DollarSign className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Expense Tracker</h1>
              <p className="text-xs text-slate-400">
                {user?.name || user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="p-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all active:scale-95 border border-red-600/30"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    {showLogoutDialog && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-sm w-full">
          <h3 className="text-lg font-bold text-white mb-2">Sign Out?</h3>
          <p className="text-slate-400 text-sm mb-6">Are you sure you want to sign out?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <form action={handleSignOut} className="flex-1">
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all active:scale-[0.98]"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;
