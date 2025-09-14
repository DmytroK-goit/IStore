export default function About() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-yellow-500">About ISTORE</h1>

      <section className="space-y-4">
        <p className="text-lg leading-relaxed">
          Welcome to <span className="font-semibold">IStore</span> — your trusted online marketplace
          for top-quality products at affordable prices. We are dedicated to making shopping{' '}
          <span className="font-semibold">simple, fast, and secure</span> for every customer.
        </p>
        <p className="text-lg leading-relaxed">
          Our store is designed to save you time and money. Whether you’re looking for everyday
          essentials, the latest gadgets, or exclusive items, we aim to provide a seamless shopping
          experience that you can always rely on.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold mb-2">✨ What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>A wide selection of high-quality products across different categories</li>
          <li>Fast and reliable delivery across Ukraine</li>
          <li>Secure and convenient payment options</li>
          <li>24/7 friendly and professional customer support</li>
          <li>Regular promotions and discounts for our loyal customers</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold mb-2">🎯 Our Mission</h2>
        <p className="text-lg leading-relaxed">
          At <span className="font-semibold">ISTORE</span>, our mission is to provide an excellent
          shopping experience for everyone. We carefully select every product to ensure it meets our
          high standards of quality, usability, and value.
        </p>
        <p className="text-lg leading-relaxed">
          We believe that shopping online should be not only convenient but also enjoyable. That’s
          why we constantly work on improving our platform, expanding our catalog, and offering the
          best customer service possible.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold mb-2">🤝 Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Trusted by thousands of customers nationwide</li>
          <li>Transparent return and refund policy</li>
          <li>Exclusive deals for registered members</li>
          <li>A growing community of satisfied shoppers</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold mb-2">📞 Contact Us</h2>
        <p className="text-lg">
          Have questions or need assistance? Our support team is always ready to help.
          <br />
          📍 <span className="font-semibold">Vinnytsia, Ukraine</span> <br />
          📞{' '}
          <a href="tel:+380979638775" className="text-blue-500 hover:underline">
            +380 97 963 8775
          </a>{' '}
          <br />
          📧{' '}
          <a href="mailto:k0vbasyuk.dim0n@gmail.com" className="text-blue-500 hover:underline">
            k0vbasyuk.dim0n@gmail.com
          </a>
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold mb-2">💡 Note</h2>
        <p className="text-lg leading-relaxed">
          This project is currently a <span className="font-semibold">pet project</span>, created
          for learning and showcasing purposes. However, it has been built with scalability in mind
          and can be transformed into a
          <span className="font-semibold">fully commercial platform</span> at any moment.
        </p>
      </section>
    </main>
  );
}
