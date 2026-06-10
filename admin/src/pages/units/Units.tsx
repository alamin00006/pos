"use client";

import { useMemo, useState } from "react";
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
import { Settings, Edit, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// RTK hooks
import {
  useGetUnitsQuery,
  useDeleteUnitMutation,
  useUpdateUnitMutation,
} from "@/redux/api/unitsApi";

import type { Unit } from "@/types/unit";

const Units = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const query = useMemo(
    () => ({
      page: 1,
      limit: 50,
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc" as const,
    }),
    [],
  );

  const {
    data: unitsRes,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetUnitsQuery(query);

  const [deleteUnit, { isLoading: deleting }] = useDeleteUnitMutation();
  const [updateUnit, { isLoading: updating }] = useUpdateUnitMutation();

  //  support both shapes: ApiResponse<PaginatedResponse<Unit>> or ApiResponse<Unit[]>
  const units: Unit[] =
    (unitsRes as any)?.data?.data ?? (unitsRes as any)?.data ?? [];

  // -------------------------
  // Edit Modal state
  // -------------------------
  const [editOpen, setEditOpen] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    shortName: "",
  });

  const openEdit = (unit: Unit) => {
    setEditingUnitId(unit.id);
    setEditForm({
      name: unit.name ?? "",
      shortName: unit.shortName ?? "",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (updating) return;
    setEditOpen(false);
    setEditingUnitId(null);
    setEditForm({ name: "", shortName: "" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUnit(id).unwrap();
      toast({ title: "Deleted", description: "Unit deleted successfully." });
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to delete unit.";
      toast({ title: "Failed", description: msg, variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    if (!editingUnitId) return;

    if (!editForm.name.trim()) {
      toast({
        title: "Validation",
        description: "Unit name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUnit({
        id: editingUnitId,
        data: {
          name: editForm.name.trim(),
          shortName: editForm.shortName.trim()
            ? editForm.shortName.trim()
            : undefined,
        },
      }).unwrap();

      toast({ title: "Updated", description: "Unit updated successfully." });
      closeEdit();
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update unit.";
      toast({ title: "Failed", description: msg, variant: "destructive" });
    }
  };

  const renderResult = (u: Unit) => {
    const c = u.conversion;
    if (!c?.relatedToId || !c?.factor) return "-";
    const base = c.relatedTo?.shortName || c.relatedTo?.name || "-";
    return `1 ${u.name} = ${c.factor} ${base}`;
  };

  return (
    <DashboardLayout title="Units">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-border">
          <button className="pb-3 px-1 text-sm font-medium text-primary border-b-2 border-primary">
            UNITS
          </button>

          <button
            onClick={() => navigate("/units/add")}
            className="pb-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            + ADD UNIT
          </button>

          <div className="ml-auto pb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Units Table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Units</h3>

              {isLoading ? (
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Total: {(unitsRes as any)?.data?.meta?.total ?? units.length}
                </span>
              )}
            </div>

            {isError ? (
              <div className="p-6">
                <p className="text-sm text-destructive">
                  Failed to load units.
                </p>
                <pre className="text-xs text-muted-foreground mt-2 overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            ) : null}

            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">
                    #
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Main Unit
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Sub Unit
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Conversion
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Sub Unit Qty
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Result
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">
                    #
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Loading units...
                    </TableCell>
                  </TableRow>
                ) : units.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No units found.
                    </TableCell>
                  </TableRow>
                ) : (
                  units.map((u, index) => {
                    const c = u.conversion;
                    const relatedTo =
                      c?.relatedTo?.shortName || c?.relatedTo?.name || "-";
                    const sign = c?.sign ?? "-";
                    const factor = c?.factor ?? "-";

                    return (
                      <TableRow key={u.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-primary font-medium">
                          {u.shortName ? `${u.shortName}` : u.name}
                        </TableCell>

                        <TableCell>{c ? relatedTo : "-"}</TableCell>
                        <TableCell>{c ? sign : "-"}</TableCell>
                        <TableCell>{c ? factor : "-"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {c ? renderResult(u) : "-"}
                        </TableCell>

                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Settings className="w-4 h-4 mr-1" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(u)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(u.id)}
                                disabled={deleting}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {isFetching && !isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Updating...
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Edit Modal (name/shortName only) */}
        <Dialog
          open={editOpen}
          onOpenChange={(v) => (!v ? closeEdit() : setEditOpen(v))}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Unit</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Unit name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-shortName">Short Name</Label>
                <Input
                  id="edit-shortName"
                  value={editForm.shortName}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, shortName: e.target.value }))
                  }
                  placeholder="e.g. kg, pc"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeEdit}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdate} disabled={updating}>
                {updating ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Units;
