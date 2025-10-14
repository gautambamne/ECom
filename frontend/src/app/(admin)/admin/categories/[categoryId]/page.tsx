import { Suspense } from 'react';
import { CategoryDetailPage } from './_components/categories-detail-page';

export default async function CategoryDetailPageWrapper(
  {
  params
  }: {
    params: Promise<{ categoryId: string }>;
  }
) {

  const { categoryId } = await params;

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading category...</p>
        </div>
      </div>
    }>
      <CategoryDetailPage categoryId={categoryId} />
    </Suspense>
  );
}