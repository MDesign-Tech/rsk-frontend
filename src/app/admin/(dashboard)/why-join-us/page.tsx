import { PageHeader } from "@/components/admin/page-header";
import { WhyJoinUsForm } from "@/features/why-join-us/why-join-us-form";

export default function WhyJoinUsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Why Join Us"
        description="Manage the Why Join Us section content and points."
      />
      <WhyJoinUsForm />
    </div>
  );
}
