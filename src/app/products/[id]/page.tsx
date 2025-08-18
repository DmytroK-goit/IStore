export default function ProductPage({
  params,
}: {
  params: Record<string, string>;
}) {
  return (
    <div>
      <h1>Product details</h1>
      <p>Product ID: {params.id}</p>
    </div>
  );
}
