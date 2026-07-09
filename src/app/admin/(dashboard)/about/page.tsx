import { PageHeader } from "@/components/admin/page-header";
import { AboutForm } from "@/features/about/about-form";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="About Us" description="Manage the about section content." />
      <AboutForm />
    </div>
  );
}
