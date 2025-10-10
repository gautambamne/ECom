"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import ProductEdit from "@/app/(vendor)/vendor/_components/Product-edit";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  const handleBack = () => {
    router.push(`/vendor/products/${resolvedParams.id}`);
  };

  const handleSuccess = () => {
    router.push(`/vendor/products/${resolvedParams.id}`);
  };

  return (
    <ProductEdit
      productId={resolvedParams.id}
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
}
