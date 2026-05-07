import { useState } from "react";
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
import { Eye, Trash2 } from "lucide-react";
import { useDeleteDamageMutation, useGetDamagesQuery } from "@/redux/api/damagesApi";
import { toast } from "@/hooks/use-toast";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : "-";

const getItems = (damage: any) => damage?.items || damage?.damageItems || [];

const Damages = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });
  const [query, setQuery] = useState<any>({ page: 1, limit: 25 });
  const { data, isLoading, isFetching } = useGetDamagesQuery(query);
  const [deleteDamage, { isLoading: deleting }] = useDeleteDamageMutation();

  const damages = data?.data ?? [];
  const meta = data?.meta;

  const handleFilter = () => {
    setPage(1);
    setQuery({
      page: 1,
      limit: 25,
      search: filters.search || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    });
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    setQuery((prev: any) => ({ ...prev, page: nextPage }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this damage record?")) return;
    try {
      await deleteDamage(id).unwrap();
      toast({ title: "Deleted", description: "Damage record deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.data?.message || "Could not delete damage record",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Damages">
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Inventory control
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-950">
              Damages
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review damaged stock entries, affected products, quantities, and notes.
            </p>
          </div>
        </section>

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
        <div className="bg-card rounded-lg border border-primary/10 p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Name
              </label>
              <Input
                placeholder="Search damages"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                From Date
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                To Date
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleFilter}
              >
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-primary/10 overflow-hidden shadow-sm">
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : damages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    No damages found
                  </TableCell>
                </TableRow>
              ) : (
                damages.map((damage: any, index: number) => {
                  const items = getItems(damage);
                  const productNames =
                    items
                      .map((item: any) => item.product?.name || item.productName)
                      .filter(Boolean)
                      .join(", ") || "-";
                  const productCodes =
                    items
                      .map((item: any) => item.product?.code || item.productCode)
                      .filter(Boolean)
                      .join(", ") || "-";
                  const quantity = items.reduce(
                    (sum: number, item: any) => sum + Number(item.quantity || 0),
                    0
                  );

                  return (
                    <TableRow key={damage.id} className="hover:bg-muted/30">
                      <TableCell>{(page - 1) * 25 + index + 1}</TableCell>
                      <TableCell>{formatDate(damage.date || damage.createdAt)}</TableCell>
                      <TableCell>{productNames}</TableCell>
                      <TableCell>{productCodes}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {damage.reason || damage.notes || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            disabled={deleting}
                            onClick={() => handleDelete(damage.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
            {isFetching ? " - Updating..." : ""}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => changePage(page - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta ? page >= meta.totalPages : true}
              onClick={() => changePage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Damages;
