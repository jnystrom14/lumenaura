
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
              <TableHead className="text-center">COLOR(S)</TableHead>
              <TableHead className="text-center">GEM(S)/PRECIOUS METAL(S)</TableHead>
              <TableHead className="text-center">KEY WORD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {numerologyDataset.map((data, index) => (
              <TableRow key={data.number} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <TableCell className="text-center font-medium">{data.number}</TableCell>
                <TableCell className="text-center">{data.color}</TableCell>
                <TableCell className="text-center">{data.gem}</TableCell>
                <TableCell className="text-center">{data.powerWord}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NumerologyTable;
