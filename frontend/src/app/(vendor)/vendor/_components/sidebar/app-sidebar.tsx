"use client"

import * as React from "react"
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingCart,
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
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Overview",
          url: "/vendor/dashboard",
        },
        {
          title: "Sales Analytics", 
          url: "/vendor/dashboard/analytics",
        },
        {
          title: "Performance Metrics",
          url: "/vendor/dashboard/metrics",
        },
        {
          title: "Stock Alerts",
          url: "/vendor/dashboard/alerts",
        },
      ],
    },
    {
      title: "Products",
      url: "products",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/vendor/products",
        },
        {
          title: "Add New Product",
          url: "/vendor/products/new",
        },
        {
          title: "Low Stock Items",
          url: "/vendor/products/low-stock",
        },
        {
          title: "Size Matrix",
          url: "/vendor/products/sizes",
        },
        {
          title: "Color Variants",
          url: "/vendor/products/variants",
        },
        {
          title: "Top Performers",
          url: "/vendor/products/top-performers",
        }
      ],
    },
    {
      title: "Orders",
      url: "orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/vendor/orders",
        },
        {
          title: "New Orders",
          url: "/vendor/orders/new",
        },
        {
          title: "Processing",
          url: "/vendor/orders/processing",
        },
        {
          title: "Shipped",
          url: "/vendor/orders/shipped",
        },
        {
          title: "Delivered",
          url: "/vendor/orders/delivered",
        },
        {
          title: "Returns",
          url: "/vendor/orders/returns",
        },
      ],
    },
    {
      title: "Analytics",
      url: "analytics",
      icon: BarChart3,
      items: [
        {
          title: "Sales Reports",
          url: "/vendor/analytics/sales",
        },
        {
          title: "Customer Insights",
          url: "/vendor/analytics/customers",
        },
        {
          title: "Product Performance",
          url: "/vendor/analytics/products",
        },
        {
          title: "Revenue Trends",
          url: "/vendor/analytics/revenue",
        },
      ],
    },
    {
      title: "Customers",
      url: "customers",
      icon: Users,
      items: [
        {
          title: "Customer List",
          url: "/vendor/customers",
        },
        {
          title: "Customer Reviews",
          url: "/vendor/customers/reviews",
        },
        {
          title: "Loyalty Program",
          url: "/vendor/customers/loyalty",
        },
      ],
    },
    {
      title: "Payments",
      url: "payments", 
      icon: CreditCard,
      items: [
        {
          title: "Earnings Overview",
          url: "/vendor/payments/earnings",
        },
        {
          title: "Payout History",
          url: "/vendor/payments/payouts",
        },
        {
          title: "Financial Reports",
          url: "/vendor/payments/reports",
        },
        {
          title: "Tax Documents",
          url: "/vendor/payments/tax",
        },
      ],
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
      items: [
        {
          title: "Store Profile",
          url: "/vendor/settings/profile",
        },
        {
          title: "Shipping Settings",
          url: "/vendor/settings/shipping",
        },
        {
          title: "Payment Methods",
          url: "/vendor/settings/payment-methods",
        },
        {
          title: "Notifications",
          url: "/vendor/settings/notifications",
        },
        {
          title: "Brand Settings",
          url: "/vendor/settings/brand",
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
