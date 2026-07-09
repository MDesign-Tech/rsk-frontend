import { PageHeader } from "@/components/admin/page-header";
import { MissionVisionForm } from "@/features/mission-vision/mission-vision-form";

export default function MissionVisionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mission & Vision"
        description="Manage the mission and vision statement shown on the homepage."
      />
      <MissionVisionForm />
    </div>
  );
}
