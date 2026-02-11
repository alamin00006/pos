"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, Search, Edit, Trash2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import {
  useDeleteOwnerMutation,
  useGetOwnersQuery,
} from "@/redux/api/ownerApi";
import EditOwnerModal from "./EditOwnerModal";

export default function Owners() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"owners" | "add">("owners");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, refetch } = useGetOwnersQuery(
    searchTerm ? { q: searchTerm } : undefined,
  ) as any;

  const [deleteOwner, { isLoading: deleting }] = useDeleteOwnerMutation();

  const owners = useMemo(() => data?.data ?? [], [data?.data]);

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this owner?")) return;
    try {
      await deleteOwner(id).unwrap();
      toast({ title: "Deleted", description: "Owner deleted successfully." });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e?.data?.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Owners">
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-semibold text-foreground">Owners</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-10 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("owners")}
            className={[
              "pb-3 text-xs font-semibold tracking-widest uppercase",
              activeTab === "owners"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Owners
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("add");
              navigate("/owners/add");
            }}
            className={[
              "pb-3 text-xs font-semibold tracking-widest uppercase flex items-center gap-2",
              activeTab === "add"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            <Plus className="h-4 w-4" />
            Add Owner
          </button>

          <div className="flex-1" />
        </div>

        {/* Container */}
        <div className="rounded-sm border border-border bg-card shadow-sm">
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-foreground">Owners</h2>

              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 h-9 rounded-sm bg-background"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading && (
              <div className="text-sm text-muted-foreground">Loading...</div>
            )}

            {isError && (
              <div className="text-sm text-destructive">
                Failed to load.{" "}
                <button className="underline" onClick={() => refetch()}>
                  Retry
                </button>
              </div>
            )}

            {!isLoading && !isError && (
              <div className="overflow-x-auto border border-border rounded-sm">
                <Table>
                  <TableHeader>
                    {/* Header = primary color */}
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground w-14">
                        #
                      </TableHead>
                      <TableHead className="text-primary-foreground">
                        Name
                      </TableHead>
                      <TableHead className="text-primary-foreground">
                        Mobile
                      </TableHead>
                      <TableHead className="text-primary-foreground">
                        Address
                      </TableHead>
                      <TableHead className="text-primary-foreground">
                        Invested
                      </TableHead>
                      <TableHead className="text-primary-foreground">
                        Withdrawn
                      </TableHead>
                      <TableHead className="text-primary-foreground">
                        Balance
                      </TableHead>
                      <TableHead className="text-primary-foreground w-24 text-center">
                        #
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {owners?.map((o: any, idx: number) => (
                      <TableRow
                        key={o.id}
                        className="bg-card hover:bg-muted/40"
                      >
                        <TableCell className="text-muted-foreground">
                          {idx + 1}
                        </TableCell>

                        <TableCell className="font-medium text-foreground">
                          {o.name}
                        </TableCell>

                        <TableCell className="text-foreground">
                          {o.phone ?? o.mobile}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {o.address ?? "-"}
                        </TableCell>

                        <TableCell className="text-foreground">
                          {o.invested ?? 0}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {o.withdrawn ?? 0}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {o.balance ?? 0}
                        </TableCell>

                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                className="h-8 px-3 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={deleting}
                              >
                                <span className="mr-1">⚙</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOwner(o);
                                  setEditOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => onDelete(o.id)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {owners?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-10 text-center">
                          <div className="text-sm text-muted-foreground">
                            No owners found
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        <Card className="hidden">
          <CardContent />
        </Card>
        <EditOwnerModal
          open={editOpen}
          onOpenChange={setEditOpen}
          owner={selectedOwner}
          refetch={refetch}
        />
      </div>
    </DashboardLayout>
  );
}
