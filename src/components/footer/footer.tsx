import Link from 'next/link';
import { MapPin, Home, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      className="w-full flex flex-col items-center justify-center gap-6 py-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/img/bg_footer.webp')" }}
    >
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-6 md:px-16">
        <div className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-yellow-400 hover:underline">
            Home
          </Link>
          <Link href="/contactUs" className="text-sm text-yellow-400 hover:underline">
            Contact Us
          </Link>
          <Link href="/about" className="text-sm text-yellow-400 hover:underline">
            About Us
          </Link>
        </div>

        <address className="not-italic text-gray-300">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span>Ukraine, Vinnitsa</span>
            </li>
            <li className="flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-500" />
              <span>Soborna 1</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-500" />
              <span>+380 97 963 8775</span>
            </li>
          </ul>
        </address>
      </div>

      <p className="text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} ISTORE. All rights reserved.
      </p>
    </footer>
  );
};
