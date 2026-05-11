"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload as UploadIcon,
  X,
  Sparkles,
  Image as ImageIcon,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAndAnalyze, saveAnalysisToSession } from "@/lib/api";

// ─── constants ────────────────────────────────────────────────────────────────
const ANALYSIS_STAGES = [
  "Detecting facial landmarks…",
  "Measuring facial symmetry…",
  "Analysing jawline & cheekbones…",
  "Evaluating skin quality…",
  "Calculating golden ratio…",
  "Generating glow-up roadmap…",
];

const MAX_FILE_SIZE_MB = 10;

// ─── helpers ──────────────────────────────────────────────────────────────────
function compressIfNeeded(file: File): Promise<File> {
  if (file.size <= 2 * 1024 * 1024) return Promise.resolve(file);

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) =>
          resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
        "image/jpeg",
        0.88
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// ─── component ────────────────────────────────────────────────────────────────
export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState(ANALYSIS_STAGES[0]);
  const [error, setError] = useState<string | null>(null);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── dropzone ──────────────────────────────────────────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }
    setError(null);
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    multiple: false,
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  // ── fake analysis-stage ticker ────────────────────────────────────────────
  const startStageTicker = () => {
    let idx = 0;
    setStageLabel(ANALYSIS_STAGES[0]);
    setAnalyzeProgress(0);

    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        const nextIdx = Math.min(
          Math.floor(((prev + 1) / 100) * ANALYSIS_STAGES.length),
          ANALYSIS_STAGES.length - 1
        );
        if (nextIdx !== idx) {
          idx = nextIdx;
          setStageLabel(ANALYSIS_STAGES[nextIdx]);
        }
        if (prev >= 98) { clearInterval(interval); return 98; }
        return prev + 1;
      });
    }, 60);

    tickerRef.current = interval;
    return interval;
  };

  // ── main flow ─────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) return;
    setError(null);
    setIsProcessing(true);

    const ticker = startStageTicker();

    try {
      const compressed = await compressIfNeeded(file);
      const { xhr, promise } = uploadAndAnalyze(compressed, setUploadProgress);
      xhrRef.current = xhr;

      const data = await promise;

      saveAnalysisToSession(data, preview ?? undefined);

      clearInterval(ticker);
      setAnalyzeProgress(100);
      setStageLabel("Analysis complete ✓");

      await new Promise((r) => setTimeout(r, 500));
      router.push("/results");
    } catch (err: any) {
      clearInterval(ticker);
      setIsProcessing(false);
      setUploadProgress(0);
      setAnalyzeProgress(0);
      setError(err.message ?? "Something went wrong. Please try again.");
    }
  };

  const cancelUpload = () => {
    xhrRef.current?.abort();
    if (tickerRef.current) clearInterval(tickerRef.current);
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Sparkles className="w-6 h-6 text-purple-500" />
          <span className="text-xl font-bold">PrimeLens AI</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-xl mb-6 flex items-start gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
            >
              <WifiOff className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Upload failed</p>
                <p className="text-xs opacity-80 mt-0.5">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto shrink-0">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ── IDLE STATE ────────────────────────────────────────────────── */}
          {!isProcessing && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl flex flex-col items-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">
                Upload Your Selfie
              </h1>
              <p className="text-muted-foreground mb-8 text-center max-w-md text-sm">
                Face the camera directly with good lighting and a neutral
                expression. Remove glasses and keep hair away from your face.
              </p>

              {/* Drop zone */}
              <div
                {...getRootProps()}
                className={[
                  "w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden",
                  "aspect-square max-h-[400px] md:aspect-video",
                  isDragActive
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 hover:border-white/30 hover:bg-white/5",
                  preview ? "border-none p-0" : "p-8",
                ].join(" ")}
              >
                <input {...getInputProps()} id="selfie-input" />

                {preview ? (
                  <div className="relative w-full h-full group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium flex items-center gap-2">
                        <UploadIcon className="w-5 h-5" /> Change Photo
                      </p>
                    </div>
                    <button
                      id="clear-photo-btn"
                      onClick={clearFile}
                      className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium mb-1">
                      Drag &amp; Drop your photo here
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      or click to browse · JPEG / PNG / WebP · max {MAX_FILE_SIZE_MB} MB
                    </p>
                    <Button variant="secondary" className="rounded-full">
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              {file && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {file.name} &mdash; {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}

              <div className="mt-8 w-full flex justify-center">
                <Button
                  id="analyze-btn"
                  size="lg"
                  onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                  disabled={!file}
                  className="w-full md:w-auto px-12 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-40 disabled:shadow-none transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyse My Face
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── PROCESSING STATE ──────────────────────────────────────────── */}
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md flex flex-col items-center text-center"
            >
              {/* Scanning frame */}
              <div className="relative w-48 h-48 mb-10">
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Scanning"
                    className="w-full h-full object-cover rounded-3xl opacity-50 grayscale"
                  />
                )}

                {/* Sweeping scan line */}
                <motion.div
                  className="absolute inset-x-0 h-[20%] bg-gradient-to-b from-transparent via-purple-500/60 to-transparent pointer-events-none"
                  animate={{ top: ["-20%", "120%"] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                />

                {/* Corner brackets */}
                {(["top-0 left-0","top-0 right-0 rotate-90","bottom-0 right-0 rotate-180","bottom-0 left-0 -rotate-90"] as const).map(
                  (cls, i) => (
                    <span
                      key={i}
                      className={`absolute ${cls} w-6 h-6 border-t-2 border-l-2 border-purple-400`}
                    />
                  )
                )}

                {/* Spinning rings */}
                <div className="absolute -inset-4 border-2 border-purple-500/30 rounded-[2rem] border-dashed animate-[spin_10s_linear_infinite]" />
                <div className="absolute -inset-8 border border-pink-500/20 rounded-[2.5rem] border-dotted animate-[spin_15s_linear_infinite_reverse]" />
              </div>

              <h2 className="text-2xl font-bold mb-1">Analysing Features</h2>
              <p className="text-purple-400 font-medium h-6 text-sm">{stageLabel}</p>

              {/* Upload progress bar */}
              {uploadProgress < 100 && (
                <div className="w-full mt-5">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Uploading image</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </div>
              )}

              {/* AI analysis progress bar */}
              <div className="w-full mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>AI analysis</span>
                  <span>{analyzeProgress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${analyzeProgress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>

              <button
                onClick={cancelUpload}
                className="mt-8 text-xs text-muted-foreground hover:text-red-400 transition-colors underline underline-offset-2"
              >
                Cancel upload
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
