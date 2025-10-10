"use client";

import * as React from "react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingCart,
  Users,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

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
        },
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="relative border-r border-gray-200/50 dark:border-gray-700/50 
                 bg-white/80 dark:bg-black/80 
                 backdrop-blur-xl shadow-xl"
      {...props}
    >
      {/* Gradient Background Overlay - Theme Adaptive */}
      <div
        className="absolute inset-0 
                    bg-gradient-to-b from-slate-50/50 via-white/30 to-slate-100/40 
                    dark:from-black dark:via-black/95 dark:to-black 
                    pointer-events-none"
      />

      {/* Animated Background Blobs - Matching Dashboard */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
        <div
          className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 dark:bg-purple-700 
                      rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl 
                      opacity-20 dark:opacity-10 animate-blob"
        />
        <div
          className="absolute top-20 -right-10 w-40 h-40 bg-violet-300 dark:bg-violet-700 
                      rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl 
                      opacity-20 dark:opacity-10 animate-blob animation-delay-2000"
        />
        <div
          className="absolute -bottom-10 left-10 w-40 h-40 bg-fuchsia-300 dark:bg-fuchsia-700 
                      rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl 
                      opacity-20 dark:opacity-10 animate-blob animation-delay-4000"
        />
      </div>

      {/* Header */}
      <SidebarHeader
        className="relative border-b border-gray-200/50 dark:border-gray-700/50 
                               bg-white/40 dark:bg-black/40 backdrop-blur-xl"
      >
        <Link
          href="/vendor/dashboard"
          className="flex items-center gap-3 px-4 py-4 mx-2 my-2 rounded-2xl 
                    transition-all duration-300 ease-out
                    hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10
                    dark:hover:from-violet-500/20 dark:hover:to-purple-500/20
                    focus-visible:outline-none focus-visible:ring-2 
                    focus-visible:ring-violet-500 dark:focus-visible:ring-violet-400
                    focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black
                    group relative overflow-hidden"
        >
          {/* Hover Effect Background */}
          <div
            className="absolute inset-0 bg-gradient-to-r 
                        from-violet-500/0 to-purple-500/0 
                        group-hover:from-violet-500/5 group-hover:to-purple-500/5 
                        dark:group-hover:from-violet-500/10 dark:group-hover:to-purple-500/10
                        transition-all duration-300 rounded-2xl"
          />

          <div className="relative flex items-center gap-3">
            {/* Logo Icon - Enhanced for both themes */}
            <div
              className="h-10 w-10 rounded-xl 
                          bg-gradient-to-br from-violet-600 to-fuchsia-600 
                          dark:from-violet-500 dark:to-fuchsia-500
                          flex items-center justify-center 
                          shadow-lg shadow-violet-500/30 dark:shadow-violet-500/50
                          group-hover:scale-110 
                          group-hover:shadow-xl group-hover:shadow-violet-500/40 
                          dark:group-hover:shadow-violet-500/60
                          transition-all duration-300"
            >
              <Package className="h-5 w-5 text-white" />
            </div>

            {/* Brand Text - Theme Adaptive Gradient */}
            {open && (
              <div className="flex flex-col">
                <h1
                  className="text-xl font-bold 
                             bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 
                             dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 
                             bg-clip-text text-transparent tracking-tight"
                >
                  SneakyVendor
                </h1>
                <span
                  className="text-[10px] font-medium 
                               text-gray-600 dark:text-gray-400 
                               uppercase tracking-wider -mt-0.5"
                >
                  Vendor Portal
                </span>
              </div>
            )}
          </div>
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="relative py-4 px-2">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Footer with Quick Stats */}
      <SidebarFooter
        className="relative border-t border-gray-200/50 dark:border-gray-700/50 
                               pt-4 pb-3 px-2 
                               bg-white/40 dark:bg-black/40 backdrop-blur-xl"
      >
        {open && (
          <div className="px-2 space-y-4">
            {/* Quick Stats Header */}
            <div className="flex items-center gap-2 px-2">
              <div
                className="h-1 w-1 rounded-full 
                            bg-violet-500 dark:bg-violet-400"
              />
              <span
                className="text-xs font-bold 
                             text-gray-600 dark:text-gray-400 
                             uppercase tracking-wider"
              >
                Quick Stats
              </span>
            </div>

            {/* Stats Grid - Matching Dashboard Card Style */}
            <div className="grid grid-cols-2 gap-3">
              {/* Products Stat */}
              <div
                className="group relative overflow-hidden rounded-2xl 
                            bg-gradient-to-br from-gray-50 to-gray-100/50 
                            dark:from-gray-900/50 dark:to-gray-800/30 
                            border border-gray-200/50 dark:border-gray-700/50 
                            p-3 transition-all duration-300 
                            hover:shadow-lg hover:shadow-violet-500/10 
                            dark:hover:shadow-violet-500/20"
              >
                <div
                  className="absolute inset-0 
                              bg-gradient-to-br from-violet-500/0 to-purple-500/0 
                              group-hover:from-violet-500/5 group-hover:to-purple-500/5 
                              dark:group-hover:from-violet-500/10 dark:group-hover:to-purple-500/10 
                              transition-all duration-300"
                />
                <div className="relative">
                  <div
                    className="text-2xl font-bold 
                                text-transparent bg-clip-text 
                                bg-gradient-to-r from-violet-600 to-purple-600 
                                dark:from-violet-400 dark:to-purple-400"
                  >
                    254
                  </div>
                  <div
                    className="text-[10px] font-semibold 
                                text-gray-600 dark:text-gray-400 
                                uppercase tracking-wide mt-0.5"
                  >
                    Products
                  </div>
                </div>
              </div>

              {/* Orders Stat */}
              <div
                className="group relative overflow-hidden rounded-2xl 
                            bg-gradient-to-br from-gray-50 to-gray-100/50 
                            dark:from-gray-900/50 dark:to-gray-800/30 
                            border border-gray-200/50 dark:border-gray-700/50 
                            p-3 transition-all duration-300 
                            hover:shadow-lg hover:shadow-emerald-500/10 
                            dark:hover:shadow-emerald-500/20"
              >
                <div
                  className="absolute inset-0 
                              bg-gradient-to-br from-emerald-500/0 to-teal-500/0 
                              group-hover:from-emerald-500/5 group-hover:to-teal-500/5 
                              dark:group-hover:from-emerald-500/10 dark:group-hover:to-teal-500/10 
                              transition-all duration-300"
                />
                <div className="relative">
                  <div
                    className="text-2xl font-bold 
                                text-transparent bg-clip-text 
                                bg-gradient-to-r from-emerald-600 to-teal-600 
                                dark:from-emerald-400 dark:to-teal-400"
                  >
                    573
                  </div>
                  <div
                    className="text-[10px] font-semibold 
                                text-gray-600 dark:text-gray-400 
                                uppercase tracking-wide mt-0.5"
                  >
                    Orders
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>

      {/* Rail */}
      <SidebarRail
        className="bg-gradient-to-b from-violet-500/10 to-purple-500/10 
                             dark:from-violet-500/20 dark:to-purple-500/20 
                             backdrop-blur-sm"
      />
    </Sidebar>
  );
}
