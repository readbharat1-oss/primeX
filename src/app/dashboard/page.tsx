"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, Award, Clock, ArrowUpRight, Flame } from "lucide-react";

export default function DashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
          <p className="text-muted-foreground mt-1">Here is your glow-up progress this month.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full font-medium border border-purple-500/20">
          <Flame className="w-4 h-4" /> 14 Day Streak
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Current Score", value: "8.4", icon: Award, trend: "+0.3", color: "text-purple-400", bg: "bg-purple-500/10" },
          { title: "Analyses Done", value: "12", icon: Activity, trend: "+2", color: "text-pink-400", bg: "bg-pink-500/10" },
          { title: "Goals Met", value: "7/10", icon: TrendingUp, trend: "70%", color: "text-green-400", bg: "bg-green-500/10" },
        ].map((stat, i) => (
          <motion.div key={i} variants={item} className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all group hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.trend}
              </div>
            </div>
            <h3 className="text-muted-foreground font-medium mb-1">{stat.title}</h3>
            <div className="text-3xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Chart (Mock) */}
        <motion.div variants={item} className="md:col-span-2 bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Score Progression</h2>
            <select className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-muted-foreground outline-none">
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-64 relative flex items-end justify-between gap-2 pt-10">
            {/* Mock Bar Chart */}
            {[5.2, 5.8, 6.4, 7.1, 7.8, 8.4].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/10 px-2 py-1 rounded absolute -top-4">
                  {h}
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-purple-900/50 to-purple-500 rounded-t-md hover:to-pink-500 transition-all cursor-pointer relative"
                  style={{ height: `${(h / 10) * 100}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/30 rounded-t-md" />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </div>
              </div>
            ))}
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-20">
              <div className="w-full border-t border-dashed border-white/20" />
              <div className="w-full border-t border-dashed border-white/20" />
              <div className="w-full border-t border-dashed border-white/20" />
              <div className="w-full border-t border-dashed border-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[
              { title: "Completed Routine", desc: "Skincare AM", time: "2h ago", color: "text-blue-400" },
              { title: "New Analysis", desc: "Score: 8.4 (+0.2)", time: "1d ago", color: "text-purple-400" },
              { title: "Unlocked Report", desc: "Premium Access", time: "3d ago", color: "text-pink-400" },
              { title: "Goal Met", desc: "Drink 3L Water", time: "4d ago", color: "text-green-400" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${activity.color} shadow-[0_0_10px_currentColor]`} />
                  {i !== 3 && <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/10" />}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground">{activity.desc}</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
