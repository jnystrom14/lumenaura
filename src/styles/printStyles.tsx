
import React from "react";

interface PrintStylesProps {
  children?: React.ReactNode;
}

export const PrintStyles: React.FC<PrintStylesProps> = ({ children }) => {
  return (
    <>
      <style>
        {`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .crystal-card {
              background: white !important;
              box-shadow: none !important;
            }
            @page {
              size: portrait;
              margin: 1cm;
            }
            /* Force color printing */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            /* Hide toast notifications */
            [role="status"],
            [aria-live="polite"],
            [data-radix-toast-viewport],
            [data-sonner-toast-group] {
              display: none !important;
            }
            /* Prevent content overflow */
            .grid > div {
              overflow: hidden !important;
              page-break-inside: avoid !important;
            }
            .truncate {
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              max-width: 100% !important;
            }
            /* Make sure the calendar takes full width when printing */
            .container {
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
            }
            .grid-cols-7 {
              width: 100% !important;
              grid-template-columns: repeat(7, 1fr) !important;
            }
            .crystal-card {
              width: 100% !important;
            }
          }
          
          @media (max-width: 640px) {
            .grid-cols-7 > div {
              touch-action: manipulation;
            }
          }
        `}
      </style>
      {children}
    </>
  );
};

export default PrintStyles;
