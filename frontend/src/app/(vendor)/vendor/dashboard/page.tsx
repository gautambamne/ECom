"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, ShoppingCart, TrendingUp, AlertCircle, Eye, Star, Users } from "lucide-react";
import { useState } from "react";
import RoleDebugComponent from "@/components/debug/role-debug";

export default function VendorDashboardPage() {
  const [timeRange, setTimeRange] = useState("month");

  const stats = [
    {
      title: "Total Products",
      value: "254",
      change: "+12 from last month",
      icon: Package,
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1% from last month",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Orders",
      value: "573",
      change: "+201 from last month",
      icon: ShoppingCart,
      trend: "up"
    },
    {
      title: "Growth Rate",
      value: "+12.5%",
      change: "+2.1% from last month",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentOrders = [
    { id: "ORD-1247", customer: "John Doe", product: "Air Jordan 1 Retro High", amount: "$129.99", status: "pending", date: "2 hours ago" },
    { id: "ORD-1246", customer: "Jane Smith", product: "Nike Dunk Low", amount: "$89.50", status: "completed", date: "5 hours ago" },
    { id: "ORD-1245", customer: "Mike Johnson", product: "Yeezy Boost 350 V2", amount: "$245.00", status: "processing", date: "1 day ago" },
    { id: "ORD-1244", customer: "Sarah Wilson", product: "New Balance 550", amount: "$67.99", status: "completed", date: "1 day ago" },
    { id: "ORD-1243", customer: "Alex Chen", product: "Adidas Samba OG", amount: "$95.00", status: "shipped", date: "2 days ago" },
  ];

  const lowStockProducts = [
    { name: "Air Jordan 1 High OG", sku: "AJ1-BRD-001", stock: 5, variant: "Black/Red - Size 9", price: "$170.00", image: "🔴" },
    { name: "Nike Air Force 1 '07", sku: "AF1-WHT-002", stock: 3, variant: "White - Size 8.5", price: "$110.00", image: "⚪" },
    { name: "Adidas Ultraboost 22", sku: "UB22-GRY-003", stock: 8, variant: "Gray - Size 10", price: "$190.00", image: "⚫" },
    { name: "Converse Chuck 70", sku: "CT70-NVY-004", stock: 2, variant: "Navy - Size 7.5", price: "$85.00", image: "🔵" },
  ];

  const topPerformers = [
    { name: "Nike Dunk Low Panda", sales: 156, revenue: "$13,962", rating: 4.8, views: 2840 },
    { name: "Air Jordan 1 Chicago", sales: 142, revenue: "$24,110", rating: 4.9, views: 3210 },
    { name: "Yeezy Boost 350", sales: 128, revenue: "$31,360", rating: 4.7, views: 4120 },
    { name: "New Balance 550", sales: 98, revenue: "$8,820", rating: 4.6, views: 1890 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Debug Component - Remove in production */}
        <RoleDebugComponent />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sneaker Vendor Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's your business overview.</p>
          </div>
          <div className="flex gap-2">
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders - Takes 2 columns */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900">Recent Orders</CardTitle>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-slate-900">{order.id}</div>
                      <Badge variant={getStatusColor(order.status)} className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{order.customer}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{order.product}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{order.amount}</div>
                    <div className="text-xs text-slate-500 mt-1">{order.date}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-xl font-bold text-slate-900">Low Stock Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.sku} className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-sm">{product.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{product.sku}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{product.variant}</div>
                      <div className="text-xs font-medium text-slate-700 mt-1">{product.price}</div>
                    </div>
                    <Badge variant={product.stock <= 5 ? "destructive" : "secondary"} className="text-xs">
                      {product.stock} left
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900">Top Performing Sneakers</CardTitle>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Analytics
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topPerformers.map((product, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">#{idx + 1}</Badge>
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Star className="h-3 w-3 fill-amber-600" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <div className="font-semibold text-slate-900 mb-2">{product.name}</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Sales:</span>
                      <span className="font-semibold text-slate-900">{product.sales}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Revenue:</span>
                      <span className="font-semibold text-green-600">{product.revenue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Eye className="h-3 w-3" />
                      <span>{product.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-500">
            <Package className="h-8 w-8 text-blue-600 mb-3" />
            <div className="font-bold text-slate-900 mb-1">Add New Product</div>
            <div className="text-sm text-slate-600">List a new sneaker in your inventory</div>
          </button>
          <button className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-green-500">
            <ShoppingCart className="h-8 w-8 text-green-600 mb-3" />
            <div className="font-bold text-slate-900 mb-1">Manage Orders</div>
            <div className="text-sm text-slate-600">Process and track customer orders</div>
          </button>
          <button className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-purple-500">
            <Users className="h-8 w-8 text-purple-600 mb-3" />
            <div className="font-bold text-slate-900 mb-1">Customer Insights</div>
            <div className="text-sm text-slate-600">View customer analytics and feedback</div>
          </button>
        </div>
      </div>
    </div>
  );
}