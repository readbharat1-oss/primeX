"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, TrendingUp, Target } from "lucide-react";

const scoreHistory = [5.2, 5.8, 6.4, 7.1, 7.8, 8.4];
const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

const goals = [
  { label: "Reach score 8.5", done: false, deadline: "Jun 2026" },
  { label: "Complete skincare streak – 30 days", done: true, deadline: "May 2026" },
  { label: "Maintain 12% body fat", done: false, deadline: "Jul 2026" },
  { label: "Try recommended hairstyle", done: true, deadline: "Apr 2026" },
  { label: "8 hours sleep for 14 days", done: false, deadline: "Jun 2026" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function ProgressPage() {
  const maxScore = 10;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Track your glow-up journey and hit your transformation goals.
        </p>
      </div>

      {/* Score timeline chart */}
      <motion.div variants={item} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" /> Score History
          </h2>
          <span className="text-sm text-muted-foreground">Last 6 months</span>
        </div>

        <div className="relative h-52 flex items-end justify-between gap-2 px-2">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 pb-6">
            {[10, 7.5, 5, 2.5].map((v) => (
              <div key={v} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-4">{v}</span>
                <div className="flex-1 border-t border-dashed border-white/40" />
              </div>
            ))}
          </div>

          {scoreHistory.map((score, i) => {
            const isLatest = i === scoreHistory.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-white/10 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                  {months[i]}: {score}
                </div>

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(score / maxScore) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
                  className={`w-full rounded-t-xl relative overflow-hidden ${
                    isLatest
                      ? "bg-gradient-to-t from-purple-700 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      : "bg-gradient-to-t from-purple-900/60 to-purple-700/40"
                  }`}
                >
                  {isLatest && (
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-white/40 rounded" />
                  )}
                </motion.div>

                <span className="text-xs text-muted-foreground">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Goal tracker */}
      <motion.div variants={item} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-400" /> Transformation Goals
          </h2>
          <span className="text-sm text-muted-foreground">
            {goals.filter((g) => g.done).length}/{goals.length} completed
          </span>
        </div>

        {/* Progress ring summary */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="url(#prog)" strokeWidth="2.5"
                strokeDasharray={`${(goals.filter((g) => g.done).length / goals.length) * 100} 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {Math.round((goals.filter((g) => g.done).length / goals.length) * 100)}%
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Keep going! You are making real progress. Completing all goals will push your score to{" "}
            <span className="text-white font-semibold">9.3+</span>.
          </p>
        </div>

        <div className="space-y-3">
          {goals.map((goal, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                goal.done
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-white/3 border-white/8 hover:border-white/15"
              }`}
            >
              {goal.done ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600 shrink-0" />
              )}
              <span className={`flex-1 font-medium ${goal.done ? "line-through text-muted-foreground" : ""}`}>
                {goal.label}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{goal.deadline}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
