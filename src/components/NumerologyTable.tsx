
import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { numerologyDataset } from "../data/numerologyData";

const NumerologyTable: React.FC = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        COLORS & NUMBERS AT A GLANCE
      </h2>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">NUMBER</TableHead>
              <TableHead className="text-center">THEME</TableHead>
              <TableHead className="text-center">COLOR(S)</TableHead>
              <TableHead className="text-center">GEM(S)/PRECIOUS METAL(S)</TableHead>
              <TableHead className="text-center">KEY PHRASE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {numerologyDataset.map((data, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <TableCell className="text-center font-medium">{data.number}</TableCell>
                <TableCell className="text-center">{data.todaysTheme || data.powerWord || ""}</TableCell>
                <TableCell className="text-center">{data.colors.join(", ")}</TableCell>
                <TableCell className="text-center whitespace-normal break-words max-w-[120px] hyphens-auto">
                  {data.gems.join(", ")}
                </TableCell>
                <TableCell className="text-center">{data.keyPhrase}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NumerologyTable;
