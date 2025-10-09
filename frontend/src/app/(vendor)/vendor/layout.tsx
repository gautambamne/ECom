'use client'
import { ScrollArea } from "@/components/ui/scroll-area";
import SideBarIndex from "./_components/sidebar";
import AuthProvider from "@/components/providers/auth-provider";
import { withAuth } from "@/components/providers/with-auth";

function VendorLayout({
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
              <div className="p-2">
                {children}
              </div>
            </ScrollArea>
          </div>
        </SideBarIndex>
      </div>
    </AuthProvider>
  )
}

// Export the layout with vendor role protection
export default withAuth(VendorLayout, {
  allowedRoles: ['VENDOR'],
  redirectTo: '/',
  showAccessDenied: true
})