"use client";

import { ChatManager } from "@/features/contact/chat-manager";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <PermissionGuard moduleName="Contact" action="read">
        <ChatManager />
      </PermissionGuard>
    </div>
  );
}
