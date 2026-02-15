"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCreateOwnerMutation } from "@/redux/api/ownerApi";
import axios from "axios";
import { getBaseUrl } from "@/helpers/config/envConfig";
import toast from "react-hot-toast";

type OwnerForm = {
  name: string;
  phone: string;
  address: string;
};

export default function AddOwner() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"owners" | "add">("add");
  const [form, setForm] = useState<OwnerForm>({
    name: "",
    phone: "",
    address: "",
  });

  const [createOwner, { isLoading }] = useCreateOwnerMutation();

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.phone.trim().length >= 11 &&
      form.address.trim().length >= 3
    );
  }, [form]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };

      const data = await createOwner(payload).unwrap();

      toast.success(data?.message || "Owner added successfully.");
      // navigate("/owners");
    } catch (err: any) {
      toast.error(err?.data?.errors?.join(", ") || err?.data?.message);
    }
  };

  return (
    <DashboardLayout title="New Owner">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">New Owner</h1>
        </div>

        <div className="flex items-center gap-6 border-b border-border">
          <button
            type="button"
            onClick={() => {
              setActiveTab("owners");
              navigate("/owners");
            }}
            className={[
              "pb-3 text-sm font-semibold tracking-wide uppercase",
              activeTab === "owners"
                ? "text-foreground border-b-2 border-emerald-500"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Owners
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={[
              "pb-3 text-sm font-semibold tracking-wide uppercase flex items-center gap-2",
              activeTab === "add"
                ? "text-foreground border-b-2 border-emerald-500"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            <Plus className="h-4 w-4" />
            Add Owner
          </button>

          <div className="flex-1" />
        </div>

        <Card className="rounded-sm border-0">
          <CardContent className="pt-6">
            <h2 className="text-sm font-semibold text-foreground mb-6">
              New Owner
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="h-10 rounded-sm border-emerald-300 focus-visible:ring-0 focus:border-emerald-500"
                  />
                  {form.name.trim() && form.name.trim().length < 2 && (
                    <p className="text-xs text-red-600">
                      Name must be at least 2 characters
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Mobile
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="h-10 rounded-sm border-emerald-300 focus-visible:ring-0 focus:border-emerald-500"
                  />
                  {form.phone.trim() && form.phone.trim().length < 11 && (
                    <p className="text-xs text-red-600">
                      Mobile must be at least 11 digits
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Address
                </label>
                <Textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="min-h-[120px] rounded-sm border-emerald-300 focus-visible:ring-0 focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="rounded-sm px-8 bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
                >
                  <span className="mr-2">🧾</span>
                  {isLoading ? "Saving..." : "Add Owner"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
