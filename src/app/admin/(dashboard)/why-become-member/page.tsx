import { PageHeader } from "@/components/admin/page-header";
import { WhyBecomeMemberForm } from "@/features/why-become-member/why-become-member-form";

export default function WhyBecomeMemberPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Why Become Member"
        description="Manage the Why Become Member section content and benefits."
      />
      <WhyBecomeMemberForm />
    </div>
  );
}
