import { PageHeader } from "@/components/admin/page-header";
import { NewsManager } from "@/features/news/news-manager";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="News" description="Manage your blog news and updates." />
      <NewsManager />
    </div>
  );
}
