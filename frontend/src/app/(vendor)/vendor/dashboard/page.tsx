"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, ShoppingCart, TrendingUp, AlertCircle, Eye, Star, Users, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleDebugComponent from "@/components/debug/role-debug";

export default function VendorDashboardPage() {
  const [timeRange, setTimeRange] = useState("month");
  const router = useRouter();

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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-6">
          
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Here's an overview of your store's performance
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {["week", "month", "year"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const isProductCard = stat.title === "Total Products";
            
            return (
              <Card 
                key={idx} 
                className={isProductCard ? 'cursor-pointer transition-colors hover:bg-muted/50' : ''}
                onClick={isProductCard ? () => router.push('/vendor/products') : undefined}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Orders */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium leading-none">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.product}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <CardTitle>Low Stock Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.sku} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                      <p className="text-xs text-muted-foreground">{product.variant}</p>
                    </div>
                    <Badge variant={product.stock <= 5 ? "destructive" : "secondary"}>
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Performing Products</CardTitle>
              <Button variant="outline" size="sm">
                View Analytics
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {topPerformers.map((product, idx) => (
                <div key={idx} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">#{idx + 1}</Badge>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span className="text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{product.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sales:</span>
                      <span className="font-medium">{product.sales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium text-green-600">{product.revenue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="p-6">
              <Package className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Add New Product</h3>
              <p className="text-sm text-muted-foreground">
                List a new sneaker in your inventory
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="p-6">
              <ShoppingCart className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Manage Orders</h3>
              <p className="text-sm text-muted-foreground">
                Process and track customer orders
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Customer Insights</h3>
              <p className="text-sm text-muted-foreground">
                View customer analytics and feedback
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}