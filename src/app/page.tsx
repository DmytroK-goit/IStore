import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to IStore</h1>
      <p>Your one-stop shop for all things tech!</p>
      <div
        className="flex gap-4 
      mt-4"
      >
        <Link
          href="/about"
          className="    inline-block    px-6 py-2    text-white font-semibold
    rounded-2xl
    bg-emerald-500
    shadow-md
    hover:bg-emerald-600
    hover:shadow-lg
    transition
    duration-300
    ease-in-out
    text-center
  "
        >
          About Us
        </Link>
        <Link
          className="
    inline-block
    px-6 py-2
    text-white
    font-semibold
    rounded-2xl
    bg-emerald-500
    shadow-md
    hover:bg-emerald-600
    hover:shadow-lg
    transition
    duration-300
    ease-in-out
    text-center
  "
          href="/products"
        >
          Products
        </Link>
        <Link
          className="
    inline-block
    px-6 py-2
    text-white
    font-semibold
    rounded-2xl
    bg-emerald-500
    shadow-md
    hover:bg-emerald-600
    hover:shadow-lg
    transition
    duration-300
    ease-in-out
    text-center
  "
          href="/login"
        >
          Login
        </Link>
        <Link
          className="
    inline-block
    px-6 py-2
    text-white
    font-semibold
    rounded-2xl
    bg-emerald-500
    shadow-md
    hover:bg-emerald-600
    hover:shadow-lg
    transition
    duration-300
    ease-in-out
    text-center
  "
          href="/register"
        >
          Registration
        </Link>
      </div>
    </div>
  );
}
