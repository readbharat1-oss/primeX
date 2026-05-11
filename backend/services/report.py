from fpdf import FPDF
import datetime
import io

class LooksMaxReport(FPDF):
    def header(self):
        # Logo or Title
        self.set_font('Arial', 'B', 15)
        self.set_text_color(168, 85, 247) # Purple
        self.cell(0, 10, 'LooksMax AI - Premium Analysis', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()} | Generated on {datetime.datetime.now().strftime("%Y-%m-%d")}', 0, 0, 'C')

def generate_pdf_report(analysis_data: dict) -> bytes:
    pdf = LooksMaxReport()
    pdf.add_page()
    
    # Header Info
    pdf.set_font('Arial', 'B', 24)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 20, f'Overall Score: {analysis_data["scores"]["overall"]}/10', 0, 1, 'C')
    pdf.ln(10)
    
    # Section: Scores
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Facial Analysis Breakdown', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)
    
    pdf.set_font('Arial', '', 12)
    for key, value in analysis_data["scores"].items():
        if key != "overall":
            pdf.cell(100, 10, f'{key.capitalize()}:', 0, 0)
            pdf.cell(0, 10, f'{value}/10', 0, 1)
    
    pdf.ln(10)
    
    # Section: Metrics
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Detailed Metrics', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)
    
    pdf.set_font('Arial', '', 12)
    for metric in analysis_data["metrics"]:
        pdf.cell(100, 10, f'{metric["name"]}:', 0, 0)
        pdf.cell(0, 10, f'{metric["value"]}% ({metric["status"]})', 0, 1)
        
    pdf.ln(10)
    
    # Section: Roadmap
    pdf.set_font('Arial', 'B', 16)
    pdf.set_text_color(168, 85, 247)
    pdf.cell(0, 10, 'Your 90-Day Glow-Up Roadmap', 0, 1, 'L')
    pdf.set_text_color(0, 0, 0)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)
    
    for category, items in analysis_data["recommendations"].items():
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, category.capitalize(), 0, 1)
        pdf.set_font('Arial', '', 11)
        for item in items:
            pdf.cell(10, 8, '-', 0, 0)
            pdf.multi_cell(0, 8, item)
        pdf.ln(5)
        
    # Final Note
    pdf.ln(10)
    pdf.set_font('Arial', 'I', 10)
    pdf.multi_cell(0, 10, 'Disclaimer: This report is for informational purposes only. Consult with professionals before starting new health or style regimens.')

    # Return as bytes
    return pdf.output()
