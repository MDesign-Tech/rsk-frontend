import { WebsiteInitializer } from "@/providers/WebsiteInitializer"
import { WebsiteProvider } from "@/providers/website-provider"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WebsiteProvider>
      <WebsiteInitializer />
      {children}
    </WebsiteProvider>
  )
}
