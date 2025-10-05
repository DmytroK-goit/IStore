import Link from 'next/link';
import { MapPin, Home, Phone } from 'lucide-react';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer
      className="relative w-full bg-cover bg-center bg-no-repeat text-gray-300"
      style={{ backgroundImage: "url('/img/bg_footer.webp')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 py-8 px-6">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:pr-6 md:pl-20">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-sm text-yellow-400 hover:text-yellow-300 transition">
              Home
            </Link>
            <Link
              href="/contactUs"
              className="text-sm text-yellow-400 hover:text-yellow-300 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className="text-sm text-yellow-400 hover:text-yellow-300 transition"
            >
              About Us
            </Link>
          </div>

          <Link
            href="/products"
            className="text-xl font-bold text-yellow-400 hover:opacity-90 transition"
          >
            <Image
              src="/img/istore.png"
              alt="Logo"
              width={100}
              height={100}
              className="drop-shadow-lg"
            />
          </Link>

          <address className="not-italic">
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-center gap-2 hover:text-emerald-400 transition">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>Ukraine, Vinnitsa</span>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-400 transition">
                <Home className="w-5 h-5 text-emerald-500" />
                <span>Soborna 1</span>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-400 transition">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span>+380 97 963 8775</span>
              </li>
            </ul>
          </address>
        </div>

        <p className="text-xs text-gray-400 text-center border-t border-gray-700 pt-4 w-full">
          © {new Date().getFullYear()} ISTORE. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
