"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Edit, Trash2 } from "lucide-react";

interface Unit {
  id: number;
  name: string;
  relatedTo: string;
  relatedSign: string;
  relatedBy: string;
  result: string;
}

const unitsData: Unit[] = [
  { id: 1, name: "pc", relatedTo: "-", relatedSign: "-", relatedBy: "-", result: "" },
  { id: 2, name: "Dozen", relatedTo: "pc", relatedSign: "*", relatedBy: "12", result: "Dozen = 1 pc * 12" },
  { id: 3, name: "gm", relatedTo: "-", relatedSign: "-", relatedBy: "-", result: "" },
  { id: 4, name: "Kg", relatedTo: "gm", relatedSign: "*", relatedBy: "1000", result: "Kg = 1 gm * 1000" },
  { id: 5, name: "ml", relatedTo: "-", relatedSign: "-", relatedBy: "-", result: "" },
  { id: 6, name: "Litre", relatedTo: "ml", relatedSign: "*", relatedBy: "1000", result: "Litre = 1 ml * 1000" },
  { id: 7, name: "k1", relatedTo: "-", relatedSign: "-", relatedBy: "-", result: "" },
  { id: 8, name: "kilo", relatedTo: "gm", relatedSign: "*", relatedBy: "1000", result: "kilo = 1 gm * 1000" },
];

const Units = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"units" | "add">("units");

  return (
    <DashboardLayout title="Units">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-border">
          <button
            onClick={() => setActiveTab("units")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "units"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            UNITS
          </button>
          <button
            onClick={() => navigate("/units/add")}
            className="pb-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            + ADD UNIT
          </button>
        </div>

        {/* Units Table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Units</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">#</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Related To</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Related Sign</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Related By</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Result</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unitsData.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>{unit.id}</TableCell>
                    <TableCell className="text-primary font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.relatedTo}</TableCell>
                    <TableCell>{unit.relatedSign}</TableCell>
                    <TableCell>{unit.relatedBy}</TableCell>
                    <TableCell>{unit.result}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            <Settings className="w-4 h-4 mr-1" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Units;
