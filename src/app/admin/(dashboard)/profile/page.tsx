import { PageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/features/profile/profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal account settings."
      />
      <ProfileForm />
    </div>
  );
}
