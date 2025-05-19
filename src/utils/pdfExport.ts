
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Add type definitions for jspdf-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface DailyProfile {
  date: Date;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  numerologyData: {
    number: number;
    color: string;
    colorHex: string;
    gem: string;
    luckyNumber: number;
    powerWord: string;
    affirmation: string;
    meaning: string;
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
    profile.numerologyData.color,
    profile.numerologyData.gem,
    profile.numerologyData.luckyNumber,
    profile.numerologyData.powerWord
  ]);
  
  // Create table
  doc.autoTable({
    startY: 30,
    head: [['Date', 'Number', 'Color', 'Gem', 'Lucky Number', 'Power Word']],
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
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 60 }
    }
  });
  
  // Add legend
  const uniqueNumbers = Array.from(new Set(profiles.map(p => p.personalDay))).sort((a, b) => a - b);
  let legendY = doc.autoTable.previous.finalY + 20;
  
  doc.setFontSize(14);
  doc.text("Legend", 14, legendY);
  legendY += 10;
  
  // Create two columns for the legend
  let column = 0;
  const columnWidth = 90;
  const itemHeight = 25;
  let startY = legendY;
  
  uniqueNumbers.forEach((num, index) => {
    const data = profiles.find(p => p.personalDay === num)?.numerologyData;
    if (!data) return;
    
    // Calculate position (2 columns)
    const x = 14 + (column * columnWidth);
    const y = startY;
    
    // Draw color box
    doc.setFillColor(hexToRgb(data.colorHex).r, hexToRgb(data.colorHex).g, hexToRgb(data.colorHex).b);
    doc.rect(x, y, 8, 8, 'F');
    
    // Add text
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Number ${num}: ${data.color}`, x + 12, y + 4);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text(`Gem: ${data.gem}`, x + 12, y + 10);
    doc.text(`Power: ${data.powerWord}`, x + 12, y + 15);
    
    // Switch to next column or row
    if (column === 0) {
      column = 1;
    } else {
      column = 0;
      startY += itemHeight;
    }
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
    profile.numerologyData.color,
    profile.numerologyData.gem,
    profile.numerologyData.luckyNumber,
    profile.numerologyData.powerWord
  ]);
  
  // Create table
  doc.autoTable({
    startY: 30,
    head: [['Date', 'Number', 'Color', 'Gem', 'Lucky Number', 'Power Word']],
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
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 50 }
    }
  });
  
  // Add legend
  const uniqueNumbers = Array.from(new Set(profiles.map(p => p.personalDay))).sort((a, b) => a - b);
  let legendY = doc.autoTable.previous.finalY + 20;
  
  doc.setFontSize(14);
  doc.text("Legend", 14, legendY);
  legendY += 10;
  
  // Create two columns for the legend
  let column = 0;
  const columnWidth = 90;
  const itemHeight = 25;
  let startY = legendY;
  
  uniqueNumbers.forEach((num, index) => {
    const data = profiles.find(p => p.personalDay === num)?.numerologyData;
    if (!data) return;
    
    // Calculate position (2 columns)
    const x = 14 + (column * columnWidth);
    const y = startY;
    
    // Draw color box
    doc.setFillColor(hexToRgb(data.colorHex).r, hexToRgb(data.colorHex).g, hexToRgb(data.colorHex).b);
    doc.rect(x, y, 8, 8, 'F');
    
    // Add text
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Number ${num}: ${data.color}`, x + 12, y + 4);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text(`Gem: ${data.gem}`, x + 12, y + 10);
    doc.text(`Power: ${data.powerWord}`, x + 12, y + 15);
    
    // Switch to next column or row
    if (column === 0) {
      column = 1;
    } else {
      column = 0;
      startY += itemHeight;
    }
  });
  
  // Add affirmations section if there's space
  if (uniqueNumbers.length <= 6) {
    const affirmationY = Math.max(startY + itemHeight, legendY + 120);
    doc.setFontSize(14);
    doc.text("Daily Affirmations", 14, affirmationY);
    
    let affRowY = affirmationY + 10;
    profiles.slice(0, 7).forEach(profile => {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`Day ${profile.date.getDate()}: Number ${profile.personalDay}`, 14, affRowY);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text(`"${profile.numerologyData.affirmation}"`, 14, affRowY + 6);
      affRowY += 15;
    });
  }
  
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
