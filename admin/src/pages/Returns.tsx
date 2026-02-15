import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw } from "lucide-react";

const Returns = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [posId, setPosId] = useState("");
  const [customer, setCustomer] = useState("all");

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setPosId("");
    setCustomer("all");
  };

  // Mock data - empty for now to match the screenshot
  const returnsList: any[] = [];

  return (
    <DashboardLayout title="Return List">
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Input
              placeholder="Pos Id"
              value={posId}
              onChange={(e) => setPosId(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Customer</SelectItem>
                <SelectItem value="mahmudul">Mahmudul Hasan - 0198784545</SelectItem>
                <SelectItem value="md-sumon">Md Sumon - 0171234567</SelectItem>
                <SelectItem value="walk-in">Walk-in Customer</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary hover:bg-primary/90">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="secondary" className="bg-secondary hover:bg-secondary/80" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Return List */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">Return List</h3>
          </div>
          
          {returnsList.length === 0 ? (
            <div className="bg-destructive/10 text-center py-4 m-4 rounded">
              <p className="text-muted-foreground">You have no Returned List</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table would go here when there's data */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">SOFTGHOR</span>. All rights reserved.
      </div>
    </DashboardLayout>
  );
};

export default Returns;
