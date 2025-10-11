"use client"

import * as React from "react"
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingCart,
  Store,
  Tag,
  Users,
} from "lucide-react"

import NavMain from "./nav-main"
import NavUser from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Navigation data for vendor portal
const data = {
    navMain: [    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Overview",
          url: "/admin/dashboard",
        },
        {
          title: "Analytics",
          url: "/admin/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/admin/dashboard/reports",
        },
      ],
    },
    {
      title: "Categories",
      url: "categories",
      icon: Tag,
      items: [
        {
          title: "All Categories",
          url: "/admin/categories",
        }
      ],
    },
    {
      title: "Vendors",
      url: "vendors",
      icon: Store,
      items: [
        {
          title: "All Vendors",
          url: "/admin/vendors",
        },
        {
          title: "Vendor Payouts",
          url: "/admin/vendors/payouts",
        },
      ],
    },
    {
      title: "Users",
      url: "users",
      icon: Home,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Add User",
          url: "/admin/users/new",
        },
        {
          title: "User Roles",
          url: "/admin/users/roles",
        },
      ],
    },
    {
      title: "Marketing",
      url: "marketing",
      icon: BarChart3,
      items: [
        {
          title: "Promotions",
          url: "/admin/marketing/promotions",
        },
        {
          title: "Coupons",
          url: "/admin/marketing/coupons",
        },
        {
          title: "Banners",
          url: "/admin/marketing/banners",
        },
      ],
    },
    {
      title: "Content",
      url: "content",
      icon: BookOpen,
      items: [
        {
          title: "Pages",
          url: "/admin/content/pages",
        },
        {
          title: "Blog Posts",
          url: "/admin/content/blog",
        },
        {
          title: "FAQs",
          url: "/admin/content/faqs",
        },
      ],
    },
  ],
}

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/vendor/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Sneaky</span>
                  <span className="truncate text-xs">Vendor Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
