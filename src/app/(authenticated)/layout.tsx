import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Sidebar>
      <Header />
      <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
    </Sidebar>
  )
}
