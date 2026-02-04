import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Users as UsersIcon, UserPlus, Save, Eye, Edit, Trash2 } from "lucide-react";

const usersData = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@softghor.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Manager",
    lastName: "User",
    email: "manager@softghor.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 3,
    firstName: "Sales",
    lastName: "User",
    email: "sales@softghor.com",
    role: "Salesman",
    status: "Active",
  },
];

const Users = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    passwordConfirmation: "",
    userImage: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, userImage: e.target.files![0] }));
    }
  };

  const handleSaveUser = () => {
    if (formData.password !== formData.passwordConfirmation) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "User Created",
      description: "New user has been created successfully.",
    });

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
      passwordConfirmation: "",
      userImage: null,
    });
  };

  const filteredUsers = usersData.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary">New User</h1>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="users"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <UsersIcon className="w-4 h-4" />
              USERS
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <UserPlus className="w-4 h-4" />
              + NEW USER
            </TabsTrigger>
          </TabsList>

          {/* Users List Tab */}
          <TabsContent value="users" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button onClick={() => window.print()}>Print</Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(172,66%,40%)] hover:bg-[hsl(172,66%,40%)]">
                    <TableHead className="text-white font-semibold">SL</TableHead>
                    <TableHead className="text-white font-semibold">
                      First Name
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Last Name
                    </TableHead>
                    <TableHead className="text-white font-semibold">Email</TableHead>
                    <TableHead className="text-white font-semibold">Role</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                    <TableHead className="text-white font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* New User Form Tab */}
          <TabsContent value="new" className="mt-0">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Make User</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="Enter First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Enter Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="salesman">Salesman</SelectItem>
                        <SelectItem value="cashier">Cashier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                  </div>

                  {/* Password Confirmation */}
                  <div className="space-y-2">
                    <Label>Password Confirmation</Label>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.passwordConfirmation}
                      onChange={(e) =>
                        handleInputChange("passwordConfirmation", e.target.value)
                      }
                    />
                  </div>

                  {/* User Image */}
                  <div className="space-y-2 lg:col-span-1">
                    <Label>User Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Image Size Must be 128x128
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveUser} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save User
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026{" "}
          <span className="text-primary font-medium">SOFTGHOR</span>. All rights
          reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default Users;
