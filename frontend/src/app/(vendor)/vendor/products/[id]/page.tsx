"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import SneakerProductDetail from "../../_components/Product-details";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  const handleBack = () => {
    router.push('/vendor/products');
  };

  const handleEdit = (product: IProduct) => {
    router.push(`/vendor/products/${resolvedParams.id}/edit`);
  };

  return (
    <SneakerProductDetail
      productId={resolvedParams.id}
      onBack={handleBack}
      onEdit={handleEdit}
      isVendorView={true}
    />
  );
}