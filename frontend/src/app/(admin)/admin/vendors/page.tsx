import { VendorDashboard } from "./_components/vendor-dashboard";

export default function VendorsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage your store vendors</p>
        </div>
        <VendorDashboard/>
      </div>
      <div className="text-center py-8">
        <p className="text-muted-foreground">Vendors management coming soon...</p>
      </div>
    </div>
  );
}