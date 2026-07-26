import { PageHeader } from "@/components/admin/page-header";
import { ChatManager } from "@/features/contact/chat-manager";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Messages"
        description="Chat with clients in real-time. Messages from the contact form appear here instantly."
      />
      <ChatManager />
    </div>
  );
}
