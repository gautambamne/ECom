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

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Optimized sneaker vendor navigation data
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
      title: "Sneaker Inventory",
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
      title: "Order Management",
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
      title: "Analytics & Reports",
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
      title: "Customer Management",
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
      title: "Store Settings",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/95 backdrop-blur-sm shadow-sm" 
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar-accent/5 to-transparent">
        <Link 
          href="/vendor/dashboard" 
          className="flex items-center px-3 py-2 mx-1 rounded-lg 
                    transition-all duration-200 ease-in-out
                    text-sidebar-primary hover:text-sidebar-primary/90 
                    hover:bg-sidebar-accent/10
                    focus-visible:outline-none focus-visible:ring-2 
                    focus-visible:ring-sidebar-ring focus-visible:ring-offset-1
                    group"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center
                          group-hover:bg-primary/15 transition-colors">
              <Package className="h-4 w-4 text-primary" />
            </div>
            {open ? (
              <div className="flex flex-col">
                <h1 className="text-sidebar-primary text-lg font-bold tracking-tight">
                  SneakyVendor
                </h1>
                <span className="text-xs text-sidebar-foreground/60 -mt-1">
                  Dashboard
                </span>
              </div>
            ) : (
              <h1 className="text-sidebar-primary text-sm font-bold tracking-tight">
                SV
              </h1>
            )}
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 pt-2 bg-sidebar-accent/5">
        {open && (
          <div className="px-3 py-2 space-y-2">
            <div className="text-xs text-sidebar-foreground/60 font-medium">
              Quick Stats
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-sidebar-accent/10 rounded-md p-2">
                <div className="text-sidebar-foreground/80 font-semibold">254</div>
                <div className="text-sidebar-foreground/60">Products</div>
              </div>
              <div className="bg-sidebar-accent/10 rounded-md p-2">
                <div className="text-sidebar-foreground/80 font-semibold">573</div>
                <div className="text-sidebar-foreground/60">Orders</div>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail className="bg-sidebar-accent/10" />
    </Sidebar>
  )
}
