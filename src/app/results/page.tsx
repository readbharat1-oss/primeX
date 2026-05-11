"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, Lock, CheckCircle2, Activity, Camera, Droplets, Scissors, Dumbbell, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadAnalysisFromSession, type AnalysisResult } from "@/lib/api";
import { generatePremiumPDF } from "@/lib/pdf";

// Default Mock Data Fallback
const defaultScores = {
  overall: 8.4,
  harmony: 8.8,
  skin: 7.5,
  style: 6.2,
  potential: 9.3
};

const defaultMetrics = [
  { name: "Facial Symmetry", value: 92, status: "Excellent" },
  { name: "Jawline Definition", value: 85, status: "Good" },
  { name: "Canthal Tilt", value: 78, status: "Positive" },
  { name: "Cheekbone Prominence", value: 88, status: "High" },
  { name: "Facial Thirds Ratio", value: 95, status: "Ideal" }
];

const defaultRecommendations = {
  skincare: ["Hydrating Cleanser (AM/PM)", "Vitamin C Serum (AM)", "Retinol 0.025% (PM, 3x/week)", "SPF 50 Daily"],
  grooming: ["Textured Fringe (Suits long face)", "Fade on sides (Mid drop fade)", "Grow stubble to 3mm", "Eyebrow threading (Keep thick)"],
  physique: ["Target 12% Bodyfat for jawline", "Hypertrophy neck training", "High protein diet (160g/day)", "Shoulder/Lat focus for V-taper"],
  habits: ["Mewing (Correct tongue posture)", "8 hours sleep (Reduces eye bags)", "Reduce sodium (Less bloating)", "Drink 3L water daily"]
};

export default function ResultsPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // Load typed data from API client helper
    const { data, previewUrl } = loadAnalysisFromSession();
    if (data) setAnalysisData(data);
    if (previewUrl) setPreviewImage(previewUrl);

    const timer = setTimeout(() => {
      if (!isUnlocked) setShowPayment(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isUnlocked]);

  const currentScores = analysisData?.scores ?? defaultScores;
  const currentMetrics = analysisData?.metrics ?? defaultMetrics;
  const currentRecommendations = analysisData?.recommendations ?? defaultRecommendations;

  const handlePaymentSuccess = () => {
    setIsUnlocked(true);
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <span className="text-xl font-bold hidden sm:block">PrimeLens AI</span>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'roadmap' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}
          >
            Roadmap
          </button>
        </div>
        <div>
          <Button 
            onClick={() => {
              if (isUnlocked && analysisData) {
                generatePremiumPDF(analysisData, previewImage);
              } else if (!isUnlocked) {
                setShowPayment(true);
              }
            }}
            variant={isUnlocked ? "outline" : "default"}
            className={isUnlocked ? "border-green-500/50 text-green-400" : "bg-purple-600 hover:bg-purple-700"}
          >
            {isUnlocked ? (
              <><Download className="w-4 h-4 mr-2" /> Download PDF</>
            ) : (
              <><Lock className="w-4 h-4 mr-2" /> Unlock Report</>
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8">
        {activeTab === "overview" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image & Main Score */}
              <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative border border-white/10 bg-white/5">
                  {previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewImage} alt="Uploaded Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-4 p-8 text-center">
                      <Camera className="w-12 h-12 opacity-50" />
                      <p>Your uploaded photo appears here securely.</p>
                    </div>
                  )}
                  {/* Overlay scanning lines */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-6 text-center shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
                  <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold mb-2">Overall Score</p>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-2">
                    {currentScores.overall}
                  </div>
                  <p className="text-purple-400 font-medium">Top 15% of users</p>
                </div>
              </div>

              {/* Stats & Metrics */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                <h2 className="text-2xl font-bold">Analysis Breakdown</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Facial Harmony", score: currentScores.harmony, color: "bg-blue-500" },
                    { label: "Skin Quality", score: currentScores.skin, color: "bg-pink-500" },
                    { label: "Style & Grooming", score: currentScores.style, color: "bg-yellow-500" },
                    { label: "Glow-up Potential", score: currentScores.potential, color: "bg-green-500" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground font-medium">{stat.label}</span>
                        <span className="text-2xl font-bold">{stat.score}</span>
                      </div>
                      <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${(stat.score / 10) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mt-4">Facial Metrics</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  {currentMetrics.map((metric: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between p-4 ${i !== currentMetrics.length - 1 ? 'border-b border-white/5' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Only show progress bar for numerical metrics, not labels like "Face Shape" */}
                        {typeof metric.value === 'number' && metric.name !== 'Face Shape' && (
                          <div className="w-24 h-1.5 bg-black rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${metric.value}%` }} />
                          </div>
                        )}
                        <span className={`text-sm px-2 py-1 rounded min-w-[80px] text-center ${metric.name === 'Face Shape' ? 'bg-purple-500/20 text-purple-400 font-bold' : 'bg-white/10 text-muted-foreground'}`}>
                          {metric.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "roadmap" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Your 90-Day Transformation</h2>
              <p className="text-muted-foreground">Based on your analysis, here is your personalized glow-up roadmap to reach your {currentScores.potential} potential score.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 relative">
              {!isUnlocked && (
                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/50 flex flex-col items-center justify-center rounded-3xl border border-white/10">
                  <div className="bg-black/80 p-8 rounded-2xl max-w-sm text-center border border-white/10 shadow-2xl">
                    <Lock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6">Unlock your personalized skincare, hairstyle, and fitness roadmap to achieve your maximum potential.</p>
                    <Button onClick={() => setShowPayment(true)} className="w-full bg-purple-600 hover:bg-purple-700">
                      Unlock Full Roadmap
                    </Button>
                  </div>
                </div>
              )}

              {/* Dynamic Content behind lock */}
              {[
                { title: "Skincare Protocol", icon: Droplets, color: "text-blue-400", bg: "bg-blue-400/10", items: currentRecommendations.skincare || defaultRecommendations.skincare },
                { title: "Hairstyle & Grooming", icon: Scissors, color: "text-pink-400", bg: "bg-pink-400/10", items: currentRecommendations.grooming || defaultRecommendations.grooming },
                { title: "Physique Goals", icon: Dumbbell, color: "text-green-400", bg: "bg-green-400/10", items: currentRecommendations.physique || defaultRecommendations.physique },
                { title: "Habits & Posture", icon: Moon, color: "text-yellow-400", bg: "bg-yellow-400/10", items: currentRecommendations.habits || defaultRecommendations.habits },
              ].map((section, i) => (
                <div key={i} className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${!isUnlocked ? 'blur-[4px]' : ''}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.bg} ${section.color}`}>
                      <section.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Payment Popup Modal */}
      <AnimatePresence>
        {showPayment && !isUnlocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -10, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] relative"
            >
              {/* Glowing accents */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-[60px] pointer-events-none" />

              <div className="p-8 text-center relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-6 border border-purple-500/20 text-purple-400">
                  <Lock className="w-6 h-6" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Unlock Your Analysis</h2>
                <div className="text-3xl font-black text-purple-400 mb-2">₹49</div>
                <p className="text-muted-foreground mb-8 text-sm max-w-[280px] mx-auto">
                  Scan the QR code with any UPI app to pay and instantly reveal your personalized roadmap.
                </p>

                {/* Animated QR Code Container */}
                <div className="relative w-56 h-56 mx-auto mb-8 group">
                  {/* Pulse animations */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[1.8rem] animate-pulse blur-xl opacity-30" />
                  <div className="absolute inset-0 border border-white/20 rounded-[1.8rem]" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1 border border-transparent border-t-purple-500 rounded-[1.8rem] opacity-50" 
                  />
                  
                  {/* QR Code */}
                  <div className="absolute inset-1.5 bg-white rounded-[1.5rem] p-3 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=primelens@upi&pn=PrimeLensAI&am=49&cu=INR" alt="UPI QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                </div>

                {/* Supported Apps */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  {["GPay", "PhonePe", "Paytm", "Navi"].map((app, i) => (
                    <div key={i} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-300 tracking-wide">
                      {app}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowPayment(false)}
                    className="flex-1 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 h-14"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={async () => {
                      handlePaymentSuccess();
                      // Generate premium PDF directly in frontend
                      if (analysisData) {
                        try {
                          await generatePremiumPDF(analysisData, previewImage);
                        } catch (err) {
                          console.error("PDF generation failed:", err);
                        }
                      }
                    }}
                    className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl h-14 shadow-[0_0_20px_rgba(255,255,255,0.2)] text-lg"
                  >
                    I've Paid
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
