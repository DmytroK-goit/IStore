import { PageProps } from "next/app";

type ProductPageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div>
      <h1>Product details</h1>
      <p>Product ID: {params.id}</p>
    </div>
  );
}
