interface Params {
  id: string;
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <div>
      <h1>Product details</h1>
      <p>Product ID: {params.id}</p>
    </div>
  );
}
