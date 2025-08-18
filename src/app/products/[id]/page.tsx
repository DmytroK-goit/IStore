interface ProductPageParams {
  id: string;
}

export default async function ProductPage({
  params,
}: {
  params: ProductPageParams;
}) {
  return (
    <div>
      <h1>Product details</h1>
      <p>Product ID: {params.id}</p>
    </div>
  );
}
