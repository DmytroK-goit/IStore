export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Product details</h1>
      <p>Product ID: {params.id}</p>
    </div>
  );
}
