"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Activity, ShieldCheck, Zap, ArrowRight, Camera, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md fixed top-0 w-full z-50 bg-background/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            PrimeLens AI
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#demo" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/upload">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-background to-background -z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>V2 AI Engine Now Live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Discover Your True <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
                Glow-Up Potential
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Upload a selfie and let our advanced AI analyze your facial harmony, skin quality, and style to provide a personalized roadmap for your ultimate transformation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/upload" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-foreground text-background hover:bg-muted-foreground text-lg px-8 h-14 rounded-full font-semibold group">
                  <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                  Analyze My Face
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-white/10 hover:bg-white/5 text-lg px-8 h-14 rounded-full font-semibold">
                  View Demo
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>Science-Based</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Facial Analytics</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Our AI measures 80+ facial landmarks to calculate your exact harmony score based on the golden ratio, symmetry, and proportions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Facial Harmony", desc: "Golden ratio analysis, symmetry checking, and proportion scoring.", icon: Activity, color: "text-blue-400", bg: "bg-blue-400/10" },
                { title: "Skin Quality", desc: "Detects acne, blemishes, texture, and provides personalized skincare routines.", icon: Sparkles, color: "text-pink-400", bg: "bg-pink-400/10" },
                { title: "Style Potential", desc: "Hairstyle, facial hair, and grooming recommendations for your face shape.", icon: Camera, color: "text-purple-400", bg: "bg-purple-400/10" }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo / How It Works */}
        <section id="demo" className="px-6 py-24 relative overflow-hidden border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How it works</h2>
              <div className="space-y-8">
                {[
                  { title: "Upload Selfie", desc: "Take a clear, well-lit photo looking straight at the camera." },
                  { title: "AI Analysis", desc: "Our vision model processes your facial structure in milliseconds." },
                  { title: "Get Your Roadmap", desc: "Receive a detailed breakdown of your strengths, weaknesses, and actionable glow-up steps." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1">{step.title}</h4>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8 bg-white text-black hover:bg-gray-200">
                Try it now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="flex-1 relative w-full aspect-square max-w-md">
              {/* Mock Dashboard Preview */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900/50 to-black border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/10" />
                    <div>
                      <div className="h-6 w-32 bg-white/20 rounded mb-2" />
                      <div className="h-4 w-24 bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="h-24 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
                      <div className="text-xs text-muted-foreground">Overall Score</div>
                      <div className="text-3xl font-bold text-purple-400">8.4</div>
                    </div>
                    <div className="h-24 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
                      <div className="text-xs text-muted-foreground">Potential</div>
                      <div className="text-3xl font-bold text-pink-400">9.2</div>
                    </div>
                  </div>
                  <div className="mt-auto h-12 w-full bg-purple-600/20 rounded-xl border border-purple-500/30 flex items-center justify-center text-purple-300 text-sm font-medium">
                    Unlock Premium Report
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="font-bold">PrimeLens AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrimeLens AI. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
