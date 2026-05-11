"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-purple-500" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Alex Johnson");
  const [email] = useState("alex@example.com");
  const [notifs, setNotifs] = useState({ weekly: true, tips: true, offers: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and notification preferences.</p>
      </div>

      {/* Profile */}
      <motion.div variants={item} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email address</label>
            <input
              value={email}
              readOnly
              className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-muted-foreground outline-none cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={item} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-pink-400" /> Notifications
        </h2>
        <div className="space-y-4">
          {[
            { key: "weekly" as const, label: "Weekly progress summary", desc: "Receive your glow-up progress report every Monday." },
            { key: "tips" as const, label: "Daily AI tips", desc: "One actionable improvement tip sent each morning." },
            { key: "offers" as const, label: "Promotions & offers", desc: "Be the first to know about discounts and new features." },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Toggle enabled={notifs[key]} onToggle={() => setNotifs((p) => ({ ...p, [key]: !p[key] }))} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div variants={item} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" /> Privacy & Data
        </h2>
        <p className="text-sm text-muted-foreground">
          Your selfies are processed locally on our servers and <strong className="text-white">never stored permanently</strong> or shared with third parties. Analysis results are kept for 90 days.
        </p>
        <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
          <Trash2 className="w-4 h-4" /> Delete all my data
        </button>
      </motion.div>

      {/* Save */}
      <motion.div variants={item} className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
        >
          <Save className="w-4 h-4" /> Save Changes
        </Button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-green-400"
          >
            ✓ Saved successfully
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
