import Link from 'next/link';
const buttonClasses = `
  block
  mx-auto
  w-[120px]
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
  mt-6
  p-2
`;

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-5xl font-semibold mb-2 text-red-200 mt-14 text-center">
        IStore – Your Tech Marketplace
      </h1>
      <p className="text-3xl font-bold mb-2 text-neutral-900 mt-10 text-center">
        Welcome to IStore
      </p>
      <p className="text-gray-300 mb-4 mt-10 text-center">
        Your one-stop shop for all things tech!
      </p>

      <div className="flex flex-wrap gap-x-10 gap-y-10 mt-6">
        <Link href="/about" className={buttonClasses}>
          About Us
        </Link>
        <Link href="/products" className={buttonClasses}>
          Shop
        </Link>
        <Link href="/login" className={buttonClasses}>
          Login
        </Link>
        <Link href="/register" className={buttonClasses}>
          Registration
        </Link>
      </div>
    </div>
  );
}
