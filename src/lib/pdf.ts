import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AnalysisResult } from "./api";

export async function generatePremiumPDF(data: AnalysisResult, previewUrl: string | null) {
  // CRITICAL FIX: Ensure 'new' keyword is used for jsPDF class instantiation
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // ── Colors & Branding ──────────────────────────────────────────────────────
  const colors = {
    background: [10, 10, 10] as [number, number, number],
    purple: [168, 85, 247] as [number, number, number],
    pink: [236, 72, 153] as [number, number, number],
    text: [255, 255, 255] as [number, number, number],
    gray: [161, 161, 170] as [number, number, number],
  };

  // Set Dark Background for the first page
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(0, 0, 210, 297, "F");

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("PrimeLens AI", 105, 25, { align: "center" });

  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(14);
  doc.text("PREMIUM GLOW-UP ANALYSIS", 105, 35, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  doc.text(`Report ID: ${data.id}`, 105, 42, { align: "center" });

  // ── Profile Photo Embedding ────────────────────────────────────────────────
  if (previewUrl) {
    try {
      doc.setDrawColor(colors.purple[0], colors.purple[1], colors.purple[2]);
      doc.setLineWidth(0.8);
      doc.roundedRect(20, 55, 45, 60, 4, 4, "S");
      doc.addImage(previewUrl, "JPEG", 21, 56, 43, 58);
    } catch (e) {
      console.warn("Failed to add image to PDF", e);
    }
  }

  // ── Overall Score Card ─────────────────────────────────────────────────────
  const cardX = previewUrl ? 75 : 55;
  const cardWidth = previewUrl ? 115 : 100;
  
  doc.setDrawColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(cardX, 55, cardWidth, 60, 5, 5, "S");
  
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(14);
  doc.text("OVERALL HARMONY SCORE", cardX + (cardWidth/2), 70, { align: "center" });
  
  doc.setFontSize(54);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  doc.text(`${data.scores.overall}`, cardX + (cardWidth/2), 95, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  doc.text("TOP 15% OF WORLDWIDE ANALYSES", cardX + (cardWidth/2), 108, { align: "center" });

  // ── Metrics Table ──────────────────────────────────────────────────────────
  doc.setFontSize(18);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.text("Facial Metrics Breakdown", 20, 135);
  
  const metricRows = data.metrics.map((m) => [m.name, `${m.value}%`, m.status]);
  
  autoTable(doc, {
    startY: 140,
    head: [["Metric", "Value", "Status"]],
    body: metricRows,
    theme: "grid",
    headStyles: {
      fillColor: [168, 85, 247] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold'
    },
    bodyStyles: { fillColor: [20, 20, 20] as [number, number, number], textColor: [230, 230, 230] as [number, number, number] },
    alternateRowStyles: { fillColor: [30, 30, 30] as [number, number, number] },
    margin: { left: 20, right: 20 },
  });

  // ── Page 2: Roadmap ────────────────────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor(colors.pink[0], colors.pink[1], colors.pink[2]);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("90-Day Transformation Roadmap", 20, 30);

  let currentY = 45;

  const categories = [
    { title: "Skincare Protocol", items: data.recommendations.skincare, color: [236, 72, 153] as [number, number, number] },
    { title: "Grooming & Hairstyle", items: data.recommendations.grooming, color: [139, 92, 246] as [number, number, number] },
    { title: "Physique & Training", items: data.recommendations.physique, color: [236, 72, 153] as [number, number, number] },
    { title: "Habits & Posture", items: data.recommendations.habits, color: [139, 92, 246] as [number, number, number] },
  ];

  categories.forEach((cat) => {
    doc.setTextColor(cat.color[0], cat.color[1], cat.color[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(cat.title, 20, currentY);
    currentY += 8;

    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    cat.items?.forEach((item) => {
      if (currentY > 270) {
        doc.addPage();
        doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
        doc.rect(0, 0, 210, 297, "F");
        currentY = 30;
      }
      doc.text(`• ${item}`, 25, currentY);
      currentY += 7;
    });
    currentY += 10;
  });

  // ── Footer ─────────────────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  doc.text("© 2026 PrimeLens AI. All rights reserved.", 105, 285, { align: "center" });

  // ── Save ───────────────────────────────────────────────────────────────────
  doc.save(`PrimeLens_Report_${data.id}.pdf`);
}
