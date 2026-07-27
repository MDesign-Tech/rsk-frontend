import api from "./api";
import type { ApiResponse, Permission, User } from "@/types";

export const permissionService = {
  getAll: () =>
    api.get<ApiResponse<{ permissions: Permission[] }>>("/permissions").then((res) => res.data),

  getUserPermissions: (userId: string) =>
    api.get<ApiResponse<{ permissions: Permission[] }>>(`/permissions/user/${userId}`).then((res) => res.data),

  getUserPermissionsByEmail: (email: string) =>
    api.get<ApiResponse<{ user: { _id: string; name: string; email: string; role: string }; permissions: Permission[] }>>(`/permissions/user-by-email/${email}`).then((res) => res.data),

  create: (data: { user: string; module: string; canCreate?: boolean; canRead?: boolean; canUpdate?: boolean; canDelete?: boolean }) =>
    api.post<ApiResponse<{ permission: Permission }>>("/permissions", data).then((res) => res.data),

  update: (id: string, data: { canCreate?: boolean; canRead?: boolean; canUpdate?: boolean; canDelete?: boolean }) =>
    api.put<ApiResponse<{ permission: Permission }>>(`/permissions/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/permissions/${id}`).then((res) => res.data),

  bulkCreate: (data: { userId: string; permissions: { module: string; canCreate?: boolean; canRead?: boolean; canUpdate?: boolean; canDelete?: boolean }[] }) =>
    api.post<ApiResponse<{ permissions: Permission[] }>>("/permissions/bulk", data).then((res) => res.data),
};
