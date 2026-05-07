"use client";

import { useMemo, useState } from "react";
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
import {
  Users as UsersIcon,
  UserPlus,
  Save,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} from "@/redux/api/usersApi";
import toast from "react-hot-toast";
import { useGetRolesQuery } from "@/redux/api/roleApi";
import UpdateUserModal from "./UpdateUserModal";

const Users = () => {
  const [activeTab, setActiveTab] = useState<any>("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  /** ---------------------------
   * API hooks
   --------------------------- */
  const { data, isLoading } = useGetUsersQuery({});
  const {
    data: roles,
    isLoading: roleGetLoading,
    isError,
    refetch,
  } = useGetRolesQuery() as any;

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data ?? [];

  /** ---------------------------
   * Form state
   --------------------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleId: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /** ---------------------------
   * Create user
   --------------------------- */
  const handleSaveUser = async () => {
    if (formData.password !== formData.passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleIds: formData.roleId ? [formData.roleId] : [],
      }).unwrap();

      toast.success("User created successfully");

      setFormData({
        name: "",
        email: "",
        roleId: "",
        password: "",
        passwordConfirmation: "",
      });

      setActiveTab("users");
    } catch (err: any) {
      toast.error(err?.data?.errors?.join(", ") || "Failed to create user");
    }
  };

  /** ---------------------------
   * Delete user
   --------------------------- */
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  /** ---------------------------
   * Search filter
   --------------------------- */
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary">Users</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b rounded-none mb-6">
            <TabsTrigger value="users" className="gap-2">
              <UsersIcon className="w-4 h-4" /> USERS
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <UserPlus className="w-4 h-4" /> NEW USER
            </TabsTrigger>
          </TabsList>

          {/* ================= USERS LIST ================= */}
          <TabsContent value="users">
            <div className="flex justify-between mb-4">
              <Input
                placeholder="Search users..."
                className="w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary">
                    <TableHead className="text-white">SL</TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Roles</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roles?.map((r) => (
                            <span
                              key={r}
                              className="px-2 py-1 text-xs rounded bg-primary/10 text-primary mr-1"
                            >
                              {r}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>
                          {user.isActive ? "Active" : "Inactive"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setEditOpen(true);
                              }}
                              size="icon"
                              variant="ghost"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
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

          {/* ================= CREATE USER ================= */}
          <TabsContent value="new">
            <div className="border rounded-lg">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={formData.passwordConfirmation}
                      onChange={(e) =>
                        handleInputChange(
                          "passwordConfirmation",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label>Role</Label>
                    <Select
                      value={formData.roleId}
                      onValueChange={(v) => handleInputChange("roleId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* replace with dynamic roles */}
                        {roles?.data?.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveUser}
                    disabled={creating}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save User
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <UpdateUserModal
          roles={roles?.data}
          open={editOpen}
          onOpenChange={setEditOpen}
          userId={selectedUserId}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;
