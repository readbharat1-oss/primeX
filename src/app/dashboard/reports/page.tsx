"use client";

import { motion } from "framer-motion";
import { FileText, Download, Lock, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockReports = [
  { id: "REP-9081", date: "09 May 2026", score: 8.4, unlocked: true },
  { id: "REP-9042", date: "27 Apr 2026", score: 7.9, unlocked: true },
  { id: "REP-8991", date: "10 Apr 2026", score: 7.6, unlocked: false },
  { id: "REP-8854", date: "24 Mar 2026", score: 7.2, unlocked: false },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function ReportsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-muted-foreground mt-1">All your previous glow-up analyses in one place.</p>
        </div>
        <Link href="/upload">
          <Button className="bg-purple-600 hover:bg-purple-700">
            + New Analysis
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {mockReports.map((report) => (
          <motion.div
            key={report.id}
            variants={item}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-lg">{report.id}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {report.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> Score {report.score}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {report.unlocked ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 gap-2"
                  onClick={() => alert(`Downloading ${report.id}…`)}
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              ) : (
                <Link href="/results">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <Lock className="w-4 h-4" /> Unlock &mdash; $9.99
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
