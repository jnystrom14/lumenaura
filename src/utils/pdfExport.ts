
import { DailyProfile } from "../types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportMonthlyPDF = (profiles: DailyProfile[], month: number, year: number): void => {
  const doc = new jsPDF();
  
  // Get month name
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
  
  // Add title
  doc.setFontSize(20);
  doc.text(`ColorPath: ${monthName} ${year}`, 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text("Monthly Numerology Calendar", 105, 22, { align: 'center' });
  
  // Prepare data for table
  const calendarData = profiles.map(profile => [
    profile.date.getDate(),
    profile.personalDay,
    profile.numerologyData.color,
    profile.numerologyData.gem,
    profile.numerologyData.powerWord
  ]);
  
  // Create table
  doc.autoTable({
    startY: 30,
    head: [['Date', 'Number', 'Color', 'Gem', 'Power Word']],
    body: calendarData,
    headStyles: { 
      fillColor: [85, 73, 188],
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [240, 240, 255]
    },
    margin: { top: 30 },
    styles: {
      cellPadding: 3,
      fontSize: 10,
      valign: 'middle',
      overflow: 'linebreak',
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: 70 }
    }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text('ColorPath - Your Daily Numerology Guide', 105, doc.internal.pageSize.height - 10, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`ColorPath_${monthName}_${year}.pdf`);
};
