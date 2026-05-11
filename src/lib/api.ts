// ─────────────────────────────────────────────────────────────
// PrimeLens AI — API Client
// ─────────────────────────────────────────────────────────────

// LOCAL BACKEND
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://primelens-api.onrender.com/api/v1";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface FacialMetric {
  name: string;
  value: number;
  status: string;
}

export interface AnalysisScores {
  overall: number;
  harmony: number;
  skin: number;
  style: number;
  potential: number;
}

export interface AnalysisRecommendations {
  skincare: string[];
  grooming: string[];
  physique: string[];
  habits: string[];
}

export interface AnalysisResult {
  id: string;
  status: string;
  scores: AnalysisScores;
  metrics: FacialMetric[];
  recommendations: AnalysisRecommendations;
}

// ─────────────────────────────────────────────────────────────
// ANALYZE FACE
// ─────────────────────────────────────────────────────────────

export function uploadAndAnalyze(
  file: File,
  onUploadProgress: (pct: number) => void
): { xhr: XMLHttpRequest; promise: Promise<AnalysisResult> } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<AnalysisResult>((resolve, reject) => {
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onUploadProgress(percent);
      }
    });

    xhr.onload = () => {
      console.log("STATUS:", xhr.status);
      console.log("RESPONSE:", xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data as AnalysisResult);
        } catch (err) {
          console.error(err);
          reject(new Error("Invalid JSON response from backend."));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);

          reject(
            new Error(
              errorData.detail ||
                `Server returned error ${xhr.status}`
            )
          );
        } catch {
          reject(new Error(`Server error ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      console.error("NETWORK ERROR");
      reject(
        new Error(
          "Network error — backend server is unreachable."
        )
      );
    };

    xhr.onabort = () => {
      reject(new Error("Upload cancelled."));
    };

    const formData = new FormData();

    // IMPORTANT
    formData.append("file", file);

    console.log("Sending request to:");
    console.log(`${BASE_URL}/analyze`);

    xhr.open("POST", `${BASE_URL}/analyze`);

    xhr.send(formData);
  });

  return { xhr, promise };
}

// ─────────────────────────────────────────────────────────────
// REPORT FETCH
// ─────────────────────────────────────────────────────────────

export async function getReport(reportId: string) {
  const response = await fetch(
    `${BASE_URL}/reports/${reportId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch report.");
  }

  return response.json();
}

// ─────────────────────────────────────────────────────────────
// SESSION STORAGE
// ─────────────────────────────────────────────────────────────

export function saveAnalysisToSession(
  data: AnalysisResult,
  previewUrl?: string
) {
  try {
    sessionStorage.setItem(
      "looksmax_analysis",
      JSON.stringify(data)
    );

    if (previewUrl) {
      sessionStorage.setItem(
        "looksmax_preview",
        previewUrl
      );
    }
  } catch (err) {
    console.error(err);
  }
}

export function loadAnalysisFromSession(): {
  data: AnalysisResult | null;
  previewUrl: string | null;
} {
  try {
    const raw = sessionStorage.getItem(
      "looksmax_analysis"
    );

    const previewUrl =
      sessionStorage.getItem("looksmax_preview");

    return {
      data: raw
        ? (JSON.parse(raw) as AnalysisResult)
        : null,
      previewUrl,
    };
  } catch {
    return {
      data: null,
      previewUrl: null,
    };
  }
}