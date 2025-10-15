"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, Calendar, Tag, MapPin, CreditCard, Trash2 } from "lucide-react";
import { VendorDeleteDialog } from "./vendor-delete";
import { VendorStatusChangeDialog } from "./vendor-status-change";

// Utility function to format dates with date-fns for Indian Standard Time
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    // Format: 15 Jan 2023, 2:30 PM (Indian format with time)
    return format(date, 'd MMM yyyy, h:mm a');
  } catch (error) {
    return "Invalid Date";
  }
};

// Status badge component for consistency
const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    case "PENDING":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>;
    case "SUSPENDED":
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Suspended</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Info item component for consistent layout
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  className?: string;
}

const InfoItem = ({ icon, label, value, className = "" }: InfoItemProps) => (
  <div className={`flex items-start gap-2 ${className}`}>
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="font-medium text-sm">{label}</p>
      <p className="text-sm text-muted-foreground break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

interface InlineVendorDetailsDialogProps {
  vendor: IVendor
  children: React.ReactNode
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: string) => void
  isLoading?: boolean
}

export function InlineVendorDetailsDialog({ 
  vendor, 
  children, 
  onAccept, 
  onReject, 
  onDelete, 
  onStatusChange,
  isLoading = false 
}: InlineVendorDetailsDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl truncate">{vendor.User?.name || 'Vendor'}</DialogTitle>
              <DialogDescription className="text-base font-medium mt-1">
                {vendor.shop_name}
              </DialogDescription>
            </div>
            <div className="flex gap-2 ml-4">
              {(onStatusChange || onAccept || onReject) && (
                <VendorStatusChangeDialog
                  vendor={vendor}
                  onAction={(id, status) => {
                    if (onStatusChange) {
                      onStatusChange(id, status);
                    } else if (status === "APPROVED" && onAccept) {
                      onAccept(id);
                    } else if ((status === "REJECTED" || status === "SUSPENDED") && onReject) {
                      onReject(id);
                    }
                    setOpen(false);
                  }}
                  isLoading={isLoading}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Change Status
                  </Button>
                </VendorStatusChangeDialog>
              )}

              {onDelete && (
                <VendorDeleteDialog
                  vendor={vendor}
                  onDelete={onDelete}
                  isLoading={isLoading}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </VendorDeleteDialog>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          {/* Status Banner */}
          <div className="flex items-center px-4 py-3 rounded-md bg-muted/50 border">
            <div className={`h-3 w-3 rounded-full mr-3 flex-shrink-0 ${
              vendor.status === "APPROVED" ? "bg-green-500" :
              vendor.status === "PENDING" ? "bg-amber-500" :
              vendor.status === "REJECTED" ? "bg-red-500" : "bg-orange-500"
            }`}>
            </div>
            <div className="font-medium">Status:</div>
            <div className="ml-2">
              {getStatusBadge(vendor.status)}
            </div>
          </div>

          {/* Vendor Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={vendor.User?.email}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Contact"
                  value={vendor.phone_number}
                />

                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Date Joined"
                  value={formatDate(vendor.created_at)}
                />

                <InfoItem
                  icon={<CreditCard className="h-4 w-4" />}
                  label="GST Number"
                  value={vendor.gst_number}
                />

                <InfoItem
                  icon={<Tag className="h-4 w-4" />}
                  label="PAN Number"
                  value={vendor.pan_number}
                />
              </div>

              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label="Shop Address"
                value={vendor.shop_address}
                className="col-span-2"
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
