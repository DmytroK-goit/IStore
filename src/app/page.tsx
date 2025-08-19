import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to IStore</h1>
      <p>Your one-stop shop for all things tech!</p>
      <div className="flex gap-4 mt-4">
        <Link href="/about">About Us</Link>
        <Link href="/products">Products</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Registration</Link>
      </div>
    </div>
  );
}
