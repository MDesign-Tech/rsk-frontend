import { PageHeader } from "@/components/admin/page-header";
import { HeroForm } from "@/features/hero/hero-form";

export default function HeroPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Hero" description="Manage the homepage hero section." />
      <HeroForm />
    </div>
  );
}
