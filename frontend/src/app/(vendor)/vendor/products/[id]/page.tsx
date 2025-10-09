"use client";

import { useRouter } from "next/navigation";
import SneakerProductDetail from "../../_components/Product-details";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (product: IProduct) => {
    router.push(`/products/vendor/${params.id}/edit`);
  };

  return (
    <SneakerProductDetail
      productId={params.id}
      onBack={handleBack}
      onEdit={handleEdit}
      isVendorView={true}
    />
  );
}