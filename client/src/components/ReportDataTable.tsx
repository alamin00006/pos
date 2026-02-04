import { useState } from "react";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface ReportDataTableProps {
  title: string;
  headerColor: "teal" | "coral" | "dark";
  columns: Column[];
  data: Record<string, unknown>[];
  footerTotals?: { label: string; value: string }[];
  showSearch?: boolean;
  showExport?: boolean;
  showEntries?: boolean;
}

const headerColorClasses = {
  teal: "bg-[hsl(172,66%,40%)]",
  coral: "bg-[hsl(15,70%,55%)]",
  dark: "bg-[hsl(215,28%,25%)]",
};

const ReportDataTable = ({
  title,
  headerColor,
  columns,
  data,
  footerTotals = [],
  showSearch = true,
  showExport = true,
  showEntries = true,
}: ReportDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / parseInt(entriesPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage)
  );

  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = data.map((row) =>
      columns.map((col) => row[col.key]).join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className={`${headerColorClasses[headerColor]} px-4 py-3`}>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>

      {/* Controls */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-2">
          {showEntries && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showExport && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={exportToCSV}
              >
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={exportToCSV}
              >
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => window.print()}
              >
                PDF
              </Button>
            </div>
          )}
          {showSearch && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Search:</span>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-40"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            {columns.map((col) => (
              <TableHead key={col.key} className="font-semibold">
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-muted-foreground">↕</span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-muted-foreground"
              >
                No data available in table
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{String(row[col.key] || "")}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Footer Totals */}
      {footerTotals.length > 0 && (
        <div className="border-t border-border">
          <div className="flex justify-end p-3 gap-6">
            {footerTotals.map((item, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium">{item.label}: </span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * parseInt(entriesPerPage) + 1} to{" "}
          {Math.min(currentPage * parseInt(entriesPerPage), filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportDataTable;
