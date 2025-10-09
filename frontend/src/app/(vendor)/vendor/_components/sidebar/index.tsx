import { AppSidebar } from "./app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"
import { Breadcrumbs } from "./breadcrumbs"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { NavUser } from "./nav-user"
import { cn } from "@/lib/utils"

export default function SideBarIndex({
    children
}:{
    children : ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className={cn(
          "flex h-16 shrink-0 items-center justify-between gap-2",
          "top-0 sticky z-30 w-full",
          "border-b border-sidebar-border/30",
          "bg-gradient-to-r from-background/90 to-background/80 backdrop-blur-md",
          "transition-all duration-200 ease-in-out",
          "group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
          "shadow-sm"
        )}>
          <div className="flex items-center gap-3 px-4">
            <SidebarTrigger className={cn(
              "-ml-1",
              "hover:bg-accent/50 focus-visible:bg-accent/50",
              "data-[state=open]:bg-accent/30",
              "size-9 rounded-md p-0",
              "border border-transparent",
              "focus-visible:border-border/40 focus-visible:ring-0"
            )} />
            
            <div className="hidden lg:block">
              <Breadcrumbs />
            </div>
            
            <div className="block lg:hidden font-medium text-lg">
              Dashboard
            </div>
          </div>
          
          <div className="flex items-center gap-1 px-4">
            
            <Button 
              size="icon" 
              variant="outline" 
              className="relative h-9 w-9 hover:bg-accent/50 transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="hidden sm:block">
              <NavUser />
            </div>
          </div>
        </header>
        
        <div className={cn(
          "flex-1 overflow-auto",
          "bg-background"
        )}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
