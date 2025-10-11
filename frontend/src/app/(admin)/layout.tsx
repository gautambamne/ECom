'use client'
import { ScrollArea } from "@/components/ui/scroll-area";
import SideBarIndex from "./admin/_components/sidebar";
import AuthProvider from "@/components/providers/auth-provider";
import { withAuth } from "@/components/providers/with-auth";

function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="overflow-hidden w-full">
        <SideBarIndex>
          <div className="relative w-full">
            <ScrollArea className="h-[calc(100vh-64px)] w-full">
              {children}
            </ScrollArea>
          </div>
        </SideBarIndex>
      </div>
    </AuthProvider>
  )
}

// Export the layout with vendor role protection
export default withAuth(AdminLayout, {
  allowedRoles: ['ADMIN'],
  redirectTo: '/',
  showAccessDenied: true
})