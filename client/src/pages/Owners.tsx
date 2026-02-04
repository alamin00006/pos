"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail } from "lucide-react";

const mockOwners = [
  {
    id: 1,
    name: "Mohammad Rahman",
    email: "rahman@example.com",
    phone: "01712345678",
    businessName: "Rahman Electronics",
    address: "Dhaka, Bangladesh",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Fatima Begum",
    email: "fatima@example.com",
    phone: "01898765432",
    businessName: "Fatima Fashion House",
    address: "Chittagong, Bangladesh",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Abdul Karim",
    email: "karim@example.com",
    phone: "01556789012",
    businessName: "Karim Grocery",
    address: "Sylhet, Bangladesh",
    status: "Inactive",
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    name: "Nasreen Akter",
    email: "nasreen@example.com",
    phone: "01623456789",
    businessName: "Nasreen Pharmacy",
    address: "Rajshahi, Bangladesh",
    status: "Active",
    joinDate: "2024-04-05",
  },
];

const Owners = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOwners = mockOwners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone.includes(searchTerm)
  );

  return (
    <DashboardLayout title="Owners">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Owner List</h1>
            <p className="text-muted-foreground">
              Manage all registered business owners
            </p>
          </div>
          <Button
            onClick={() => navigate("/owners/add")}
            className="bg-sidebar hover:bg-sidebar/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Owner
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Search Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, business, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Owners Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>All Owners ({filteredOwners.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.map((owner, index) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{owner.name}</div>
                      </TableCell>
                      <TableCell>{owner.businessName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {owner.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {owner.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{owner.address}</TableCell>
                      <TableCell>{owner.joinDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            owner.status === "Active" ? "default" : "secondary"
                          }
                          className={
                            owner.status === "Active"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {owner.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOwners.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">No owners found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Owners;
