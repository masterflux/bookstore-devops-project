// app/catalog/[category]/page.tsx

import CategoryPageClient from "./CategoryPageClient";

export default async function CategoryPageWrapper({
    params,
}: {
    params: { category: string }
}) {
    const { category } = await params;
    return <CategoryPageClient category={category} />;
}
