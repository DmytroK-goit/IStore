'use client';
import { useState, useEffect } from 'react';
import { products } from '@/data/products';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type CartItem = { id: number; quantity: number };
type SoldItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  date: string;
};
interface SoldAddress {
  name: string;
  surname: string;
  phone: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
  comment?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [detailedItems, setDetailedItems] = useState<
    ((typeof products)[0] & { quantity: number })[]
  >([]);

  // завантаження з localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart: CartItem[] = JSON.parse(storedCart);
      setCartItems(parsedCart);
      setDetailedItems(
        parsedCart.map((ci) => {
          const product = products.find((p) => p.id === ci.id);
          return { ...product, quantity: ci.quantity };
        }) as any,
      );
    }
  }, []);

  // синхронізація
  useEffect(() => {
    if (cartItems.length === 0) {
      localStorage.removeItem('cart');
      setDetailedItems([]);
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setDetailedItems(
      cartItems.map((ci) => {
        const product = products.find((p) => p.id === ci.id);
        return { ...product, quantity: ci.quantity };
      }) as any,
    );
  }, [cartItems]);

  const increaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return item;
        if (item.quantity < product.amount) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert(`Cannot add more than ${product.amount} of this product`);
        }
        return item;
      }),
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const total = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    surname: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    street: Yup.string().required('Required'),
    house: Yup.string().required('Required'),
    apartment: Yup.string(),
    comment: Yup.string(),
  });

  const handleSubmit = (values: SoldAddress, { resetForm }: { resetForm: () => void }) => {
    if (cartItems.length === 0) return;

    const soldItems: SoldItem[] = cartItems.map((ci) => {
      const product = products.find((p) => p.id === ci.id)!;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: ci.quantity,
        date: new Date().toISOString(),
      };
    });

    const order = {
      items: soldItems,
      address: values,
      total,
    };

    const existingSold = JSON.parse(localStorage.getItem('sold') || '[]');
    localStorage.setItem('sold', JSON.stringify([...existingSold, order]));

    setCartItems([]);
    resetForm();
    alert('Order placed successfully!');
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Cart</h2>
        <p>Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Cart</h2>
        <div className="space-y-4">
          {detailedItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-xl p-4 bg-white shadow-md"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-gray-700">
                  ${item.price} × {item.quantity} = ${item.price * item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <p className="text-xl font-bold">Total: ${total}</p>
        </div>
      </div>

      {/* ADDRESS FORM */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Delivery details</h2>
        <Formik
          initialValues={{
            name: '',
            surname: '',
            phone: '',
            city: '',
            street: '',
            house: '',
            apartment: '',
            comment: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <div>
                <label htmlFor="name" className="block font-medium text-gray-400">
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="First name"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="surname" className="block font-medium text-gray-400">
                  Surname
                </label>
                <Field
                  name="surname"
                  placeholder="Last name"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage name="surname" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block font-medium text-gray-400">
                  Phone
                </label>
                <Field name="phone" placeholder="Phone" className="w-full border p-2 rounded" />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="city" className="block font-medium text-gray-400">
                  City
                </label>
                <Field name="city" placeholder="City" className="w-full border p-2 rounded" />
                <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="street" className="block font-medium text-gray-400">
                  Street
                </label>
                <Field name="street" placeholder="Street" className="w-full border p-2 rounded" />
                <ErrorMessage name="street" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="house" className="block font-medium text-gray-400">
                  House
                </label>
                <Field name="house" placeholder="House" className="w-full border p-2 rounded" />
                <ErrorMessage name="house" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="apartment" className="block font-medium text-gray-400">
                  Apartment
                </label>
                <Field
                  name="apartment"
                  placeholder="Apartment"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label htmlFor="comment" className="block font-medium text-gray-400">
                  Comment
                </label>
                <Field
                  as="textarea"
                  name="comment"
                  placeholder="Comment"
                  className="w-full border p-2 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
              >
                Place Order
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
