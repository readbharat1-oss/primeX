"use client";

import { Activity, Users, DollarSign, FileText } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">System status and key metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Total Users", value: "12,403", icon: Users, color: "text-blue-400" },
            { title: "Analyses Run", value: "48,291", icon: Activity, color: "text-purple-400" },
            { title: "Premium Unlocks", value: "3,102", icon: FileText, color: "text-pink-400" },
            { title: "Revenue", value: "$30,988", icon: DollarSign, color: "text-green-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 \${stat.color}`} />
                </div>
              </div>
              <h3 className="text-muted-foreground font-medium mb-1">{stat.title}</h3>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Payments (Mock)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Report ID</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { user: "alex@example.com", report: "REP-9081", amount: "$9.99", status: "Completed", date: "2 mins ago" },
                  { user: "jordan@example.com", report: "REP-9080", amount: "$9.99", status: "Completed", date: "15 mins ago" },
                  { user: "taylor@example.com", report: "REP-9079", amount: "$9.99", status: "Pending", date: "1 hour ago" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3">{row.user}</td>
                    <td className="py-3 text-purple-400">{row.report}</td>
                    <td className="py-3">{row.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs \${row.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
