export default async function ProductPage({ params }: any) {
  const { id } = params;

  return (
    <div>
      <h1>Product details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}
