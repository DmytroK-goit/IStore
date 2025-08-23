export default function About() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Our Store</h1>
      <p className="text-lg mb-4">
        Welcome to <span className="font-semibold">FlexiShop</span> — your trusted online
        marketplace for quality products at the best prices. We focus on making shopping simple,
        fast, and secure.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What We Offer</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Wide selection of products</li>
          <li>Fast delivery across Ukraine</li>
          <li>Secure payment options</li>
          <li>Friendly customer support</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p>
          We want to provide an excellent shopping experience for everyone. Every product in our
          store is carefully selected to ensure quality and satisfaction.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          📍 Vinnytsia, Ukraine <br />
          📞 +380 97 963 8775 <br />
          📧 support@flexishop.com
        </p>
      </section>
    </main>
  );
}
