import { PageHeader } from "@/components/admin/page-header";
import { ContactManager } from "@/features/contact/contact-manager";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Messages"
        description="Review messages submitted through the contact form."
      />
      <ContactManager />
    </div>
  );
}
