'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-gray-200 py-10 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/3 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-yellow-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-400/10 blur-[100px] rounded-full"></div>

        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-10"></div>

        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 via-yellow-400 to-transparent opacity-60"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-4xl mx-auto relative z-10 bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-3xl p-10 shadow-2xl shadow-emerald-500/10"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-yellow-400 mb-8 text-center drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]"
        >
          Privacy Policy
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-300 leading-relaxed mb-8 text-lg text-center"
        >
          Welcome to <span className="text-emerald-400 font-semibold">ISTORE</span>. We respect your
          privacy and are committed to protecting your personal information. This policy explains
          how we collect, use, and safeguard your data when you use our services.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-10"
        >
          <div>
            <h3 className="text-2xl font-semibold text-emerald-400 mb-3">
              1. Information We Collect
            </h3>
            <p className="text-gray-400 leading-relaxed">
              We may collect personal data such as your name, email address, phone number, and
              payment information. We also gather analytical data to improve our products and
              services.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-emerald-400 mb-3">
              2. How We Use Your Data
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Your information helps us process orders, provide customer support, and send updates
              about our offers. We never sell your data to third parties.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-emerald-400 mb-3">3. Your Rights</h3>
            <p className="text-gray-400 leading-relaxed">
              You can request to view, edit, or delete your personal information at any time by
              contacting our support team.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl 
              hover:bg-yellow-300 active:scale-95 transition-all duration-300 shadow-lg shadow-yellow-400/30"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
