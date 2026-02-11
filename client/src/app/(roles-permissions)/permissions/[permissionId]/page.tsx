"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Permissions from "@/pages/RolesPermissions/Permissions";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return (
    <ProtectedRoute>
      <Permissions roleId={params.permissionId} />
    </ProtectedRoute>
  );
}
