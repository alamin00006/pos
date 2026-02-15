import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Eye, Edit, Trash2 } from "lucide-react";
const mockDamages = [
  {
    id: 1,
    date: "2026-01-28",
    productName: "Samsung Galaxy S21",
    productCode: "SAM-S21-001",
    quantity: 2,
    note: "Screen damage during transport",
  },
  {
    id: 2,
    date: "2026-01-25",
    productName: "iPhone 14 Pro",
    productCode: "APL-IP14-002",
    quantity: 1,
    note: "Water damage",
  },
  {
    id: 3,
    date: "2026-01-20",
    productName: "Sony Headphones WH-1000XM5",
    productCode: "SNY-WH5-003",
    quantity: 3,
    note: "Broken headband",
  },
];

const Damages = () => {
  return (
    <DashboardLayout title="Damages">
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border">
          <button className="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">
            DAMAGES
          </button>
          <a href="/damage/add">
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              + ADD DAMAGE
            </button>
          </a>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Name
              </label>
              <Input placeholder="Search by product name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                From Date
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                To Date
              </label>
              <Input type="date" />
            </div>
            <div className="flex items-end">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">SL</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Product Name</TableHead>
                <TableHead className="font-semibold">Product Code</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Note</TableHead>
                <TableHead className="font-semibold text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDamages.map((damage, index) => (
                <TableRow key={damage.id} className="hover:bg-muted/30">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{damage.date}</TableCell>
                  <TableCell>{damage.productName}</TableCell>
                  <TableCell>{damage.productCode}</TableCell>
                  <TableCell>{damage.quantity}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{damage.note}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-accent-foreground">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Damages;
