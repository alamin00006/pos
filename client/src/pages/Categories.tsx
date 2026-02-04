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

interface Category {
  id: number;
  name: string;
  description: string;
  productsCount: number;
}

const categoriesData: Category[] = [
  { id: 1, name: "Electronics", description: "Electronic devices and accessories", productsCount: 45 },
  { id: 2, name: "Clothing", description: "Apparel and fashion items", productsCount: 128 },
  { id: 3, name: "Groceries", description: "Food and household items", productsCount: 234 },
  { id: 4, name: "Furniture", description: "Home and office furniture", productsCount: 67 },
  { id: 5, name: "Sports", description: "Sports equipment and accessories", productsCount: 89 },
];

const Categories = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"categories" | "add">("categories");

  return (
    <DashboardLayout title="Categories">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-border">
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "categories"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            CATEGORIES
          </button>
          <button
            onClick={() => navigate("/categories/add")}
            className="pb-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            + ADD CATEGORY
          </button>
        </div>

        {/* Categories Table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Categories</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">#</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Description</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Products</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoriesData.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell className="text-primary font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.productsCount}</TableCell>
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

export default Categories;
