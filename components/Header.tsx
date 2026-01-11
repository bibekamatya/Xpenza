"use client";
import { useState } from "react";
import { handleSignOut } from "@/app/actions/authActions";
import { DollarSign, LogOut, Settings, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BudgetSettings from "./BudgetSettings";

interface HeaderProps {
  user: { image: string; email: string; name: string };
}

const Header = ({ user }: HeaderProps) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    height={32}
                    width={32}
                    className="rounded-lg"
                  />
                ) : (
                  <Image
                    src="/logo.png"
                    alt="Xpenza"
                    height={32}
                    width={32}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
              <div>
                <h1 className="text-base font-bold text-white">Xpenza</h1>
                <p className="text-xs text-slate-400">{user?.name || user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/reports"
                className="p-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-95 border border-slate-700"
                title="Reports"
              >
                <FileText className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowBudgetSettings(true)}
                className="p-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-95 border border-slate-700"
                title="Budget Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="p-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all active:scale-95 border border-red-600/30"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showLogoutDialog && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to sign out?
              </p>
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
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <BudgetSettings
        isOpen={showBudgetSettings}
        onClose={() => setShowBudgetSettings(false)}
      />
    </>
  );
};

export default Header;
