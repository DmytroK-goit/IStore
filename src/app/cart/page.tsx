'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { selectProducts } from '@/redux/Products/selectors';
import { fetchProducts } from '@/redux/Products/operations';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';

type CartItem = { id: string; quantity: number };

type SoldItem = {
  id: string;
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

const getProductId = (p: Product) => String(p._id ?? p._id);

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [detailedItems, setDetailedItems] = useState<(Product & { quantity: number })[]>([]);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart: CartItem[] = JSON.parse(storedCart);
      setCartItems(parsedCart);
    }
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    if (cartItems.length === 0) {
      localStorage.removeItem('cart');
      setDetailedItems([]);
      return;
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));

    const updatedDetailed = cartItems
      .map((ci) => {
        const product = products.find((p) => getProductId(p) === String(ci.id));
        if (!product) return null;
        return { ...product, quantity: ci.quantity };
      })
      .filter(Boolean) as (Product & { quantity: number })[];

    setDetailedItems(updatedDetailed);
  }, [cartItems, products]);

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const product = products.find((p) => getProductId(p) === id);
        if (!product) return item;
        if (item.quantity < product.quantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert(`Cannot add more than ${product.quantity} of this product`);
        }
        return item;
      }),
    );
  };

  const decreaseQuantity = (id: string) => {
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
      const product = products.find((p) => getProductId(p) === String(ci.id))!;
      return {
        id: getProductId(product),
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
      {/* Cart Items */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Cart</h2>
        <div className="space-y-4">
          {detailedItems.map((item) => (
            <div
              key={getProductId(item)}
              className="flex justify-between items-center border rounded-xl p-4 bg-white shadow-md"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-gray-700">
                  ${item.price} × {item.quantity} = ${item.price * item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(getProductId(item))}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(getProductId(item))}
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

      {/* Delivery Form */}
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
              {['name', 'surname', 'phone', 'city', 'street', 'house', 'apartment', 'comment'].map(
                (field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block font-medium text-gray-400">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <Field
                      as={field === 'comment' ? 'textarea' : 'input'}
                      id={field}
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
                  </div>
                ),
              )}
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
