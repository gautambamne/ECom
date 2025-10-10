"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, ShoppingCart, TrendingUp, AlertCircle, Eye, Star, Users, Plus, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function VendorDashboardPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: "254",
      change: "+12 from last month",
      icon: Package,
      trend: "up",
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Orders",
      value: "573",
      change: "+201 from last month",
      icon: ShoppingCart,
      trend: "up",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Growth Rate",
      value: "+12.5%",
      change: "+2.1% from last month",
      icon: TrendingUp,
      trend: "up",
      color: "from-orange-500 to-pink-500"
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

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "processing":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "shipped":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-black dark:to-black">
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:bg-purple-700 dark:opacity-10" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:bg-yellow-700 dark:opacity-10" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:bg-pink-700 dark:opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm rounded-full border border-violet-200 dark:border-violet-700 mb-4">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-semibold text-violet-900 dark:text-violet-100">Vendor Portal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Welcome back! Here's your business overview.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Time Range */}
            <div className="flex gap-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    timeRange === range
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const isProductCard = stat.title === "Total Products";
            
            return (
              <Card 
                key={idx} 
                className={`group relative overflow-hidden border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isProductCard ? 'cursor-pointer' : ''
                }`}
                onClick={isProductCard ? () => alert('Navigate to /vendor/products') : undefined}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </p>
                    </div>
                    {isProductCard && (
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-violet-600 to-fuchsia-600 rounded-full" />
                  Recent Orders
                </CardTitle>
                <button className="text-sm text-violet-600 dark:text-violet-400 hover:underline font-semibold flex items-center gap-1 group">
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.map((order, idx) => (
                <div 
                  key={order.id} 
                  className="group relative flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-bold text-foreground">{order.id}</div>
                      <Badge className={`text-xs px-3 py-1 ${getStatusBgColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-foreground">{order.customer}</div>
                    <div className="text-xs text-muted-foreground mt-1">{order.product}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                      {order.amount}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{order.date}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 backdrop-blur-xl shadow-xl overflow-hidden border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-red-500 flex items-center justify-center animate-pulse">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">Low Stock Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockProducts.map((product, idx) => (
                <div 
                  key={product.sku} 
                  className="p-4 bg-white/80 dark:bg-black/40 rounded-2xl border border-red-200 dark:border-red-900/50 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-sm mb-1">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sku}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{product.variant}</div>
                      <div className="text-sm font-bold text-foreground mt-2">{product.price}</div>
                    </div>
                    <Badge variant={product.stock <= 5 ? "destructive" : "secondary"} className="text-xs font-bold px-3 py-1">
                      {product.stock} left
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Products */}
        <Card className="border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-violet-600 to-fuchsia-600 rounded-full" />
                Top Performing Sneakers
              </CardTitle>
              <button className="text-sm text-violet-600 dark:text-violet-400 hover:underline font-semibold flex items-center gap-1 group">
                View Analytics
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {topPerformers.map((product, idx) => (
                <div 
                  key={idx} 
                  className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0 px-3 py-1 text-sm font-bold shadow-lg">
                        #{idx + 1}
                      </Badge>
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-full">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{product.rating}</span>
                      </div>
                    </div>
                    
                    <div className="font-bold text-foreground mb-4 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400 transition-all duration-300">
                      {product.name}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Sales</span>
                        <span className="font-bold text-foreground text-lg">{product.sales}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Revenue</span>
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-lg">
                          {product.revenue}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{product.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pb-8">
          <button className="group relative p-8 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div className="font-bold text-foreground mb-2 text-xl">Add New Product</div>
              <div className="text-sm text-muted-foreground">List a new sneaker in your inventory</div>
            </div>
          </button>
          
          <button className="group relative p-8 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div className="font-bold text-foreground mb-2 text-xl">Manage Orders</div>
              <div className="text-sm text-muted-foreground">Process and track customer orders</div>
            </div>
          </button>
          
          <button className="group relative p-8 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="font-bold text-foreground mb-2 text-xl">Customer Insights</div>
              <div className="text-sm text-muted-foreground">View customer analytics and feedback</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}