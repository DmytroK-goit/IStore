import Link from 'next/link';

const buttonClasses = `
  inline-block
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
  w-full
  sm:w-auto
  text-sm
 
`;

export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome to IStore</h1>
      <p className="text-gray-200 mb-4">Your one-stop shop for all things tech!</p>

      <div className="flex flex-wrap gap-4 mt-4">
        <Link href="/about" className={buttonClasses}>
          About Us
        </Link>
        <Link href="/products" className={buttonClasses}>
          Products
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
