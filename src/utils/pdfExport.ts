
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Add type definitions for jspdf-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => { previousAutoTable?: { finalY: number }; };
  }
}

export interface DailyProfile {
  date: Date;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  numerologyData: {
    number: number | string;
    colors: string[];
    gems: string[];
    keyPhrase: string;
    description: string;
    meditation: string;
  };
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
    profile.numerologyData.colors.join(", "),
    profile.numerologyData.gems.join(", "),
    profile.numerologyData.keyPhrase
  ]);
  
  // Create table
  const tableResult = doc.autoTable({
    startY: 30,
    head: [['Date', 'Number', 'Color(s)', 'Gem(s)', 'Key Phrase']],
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
      lineWidth: 0.1,
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30, overflow: 'linebreak' },
      4: { cellWidth: 60 }
    }
  });
  
  // Add affirmations section if there's space
  const affirmationY = (tableResult.previousAutoTable?.finalY || 150) + 20;
  doc.setFontSize(14);
  doc.text("Daily Meditations", 14, affirmationY);
  
  let affRowY = affirmationY + 10;
  profiles.slice(0, 7).forEach(profile => {
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Day ${profile.date.getDate()}: Number ${profile.personalDay}`, 14, affRowY);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(`"${profile.numerologyData.meditation}"`, 14, affRowY + 6);
    affRowY += 15;
  });
  
  // Add footer with page numbers
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text('ColorPath - Your Daily Numerology Guide', 105, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`ColorPath_${monthName}_${year}.pdf`);
};

export const exportDateRangePDF = (profiles: DailyProfile[], from: Date, to: Date): void => {
  const doc = new jsPDF();
  
  // Format date range for title
  const fromDate = from.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  const toDate = to.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // Add title
  doc.setFontSize(20);
  doc.text(`ColorPath: ${fromDate} - ${toDate}`, 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text("Numerology Calendar", 105, 22, { align: 'center' });
  
  // Prepare data for table
  const calendarData = profiles.map(profile => [
    profile.date.toLocaleString('default', { month: 'short', day: 'numeric' }),
    profile.personalDay,
    profile.numerologyData.colors.join(", "),
    profile.numerologyData.gems.join(", "),
    profile.numerologyData.keyPhrase
  ]);
  
  // Create table
  const tableResult = doc.autoTable({
    startY: 30,
    head: [['Date', 'Number', 'Color(s)', 'Gem(s)', 'Key Phrase']],
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
      lineWidth: 0.1,
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30, overflow: 'linebreak' },
      4: { cellWidth: 50 }
    }
  });
  
  // Add affirmations section
  const affirmationY = (tableResult.previousAutoTable?.finalY || 150) + 20;
  doc.setFontSize(14);
  doc.text("Daily Meditations", 14, affirmationY);
  
  let affRowY = affirmationY + 10;
  profiles.slice(0, 7).forEach(profile => {
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Day ${profile.date.getDate()}: Number ${profile.personalDay}`, 14, affRowY);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(`"${profile.numerologyData.meditation}"`, 14, affRowY + 6);
    affRowY += 15;
  });
  
  // Add footer with page numbers
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text('ColorPath - Your Daily Numerology Guide', 105, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  // Save the PDF
  const fromMonth = from.toLocaleString('default', { month: 'short' });
  const toMonth = to.toLocaleString('default', { month: 'short' });
  doc.save(`ColorPath_${fromMonth}${from.getDate()}-${toMonth}${to.getDate()}_${to.getFullYear()}.pdf`);
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};
