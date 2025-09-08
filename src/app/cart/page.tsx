'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchProducts } from '@/redux/Products/operations';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';
import { fetchCart, addToCart, removeFromCart } from '@/redux/Cart/operations';
import { selectCartItems } from '@/redux/Cart/selectors';
import { selectProducts } from '@/redux/Products/selectors';
import { CartItem, setCartItemQuantity } from '@/redux/Cart/sliсe';

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

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const cart: CartItem[] = useSelector(selectCartItems);

  const [detailedItems, setDetailedItems] = useState<(Product & { cartQuantity: number })[]>([]);

  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProducts());
    dispatch(fetchCart());
  }, [dispatch, products]);

  useEffect(() => {
    const cartItemsArray = cart || [];
    if (!products || cartItemsArray.length === 0) {
      setDetailedItems([]);
      return;
    }

    const updatedDetailed = cartItemsArray
      .map((ci) => {
        const product = products.find((p) => p._id === ci.productId);
        if (!product) return null;
        return { ...product, cartQuantity: ci.quantity };
      })
      .filter(Boolean) as (Product & { cartQuantity: number })[];

    setDetailedItems(updatedDetailed);
  }, [cart, products]);

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number,
    stock: number,
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1 || newQuantity > stock) return;
    dispatch(setCartItemQuantity({ productId, quantity: newQuantity }));
  };

  const total = detailedItems.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

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
    const cartItemsArray = cart || [];
    if (cartItemsArray.length === 0) return;

    const soldItems: SoldItem[] = cartItemsArray.map((ci) => {
      const product = products.find((p) => p._id === ci.productId)!;
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: ci.quantity,
        date: new Date().toISOString(),
      };
    });

    const order = { items: soldItems, address: values, total };
    const existingSold = JSON.parse(localStorage.getItem('sold') || '[]');
    localStorage.setItem('sold', JSON.stringify([...existingSold, order]));

    resetForm();
    alert('Order placed successfully!');
  };

  if (!cart || cart.length === 0) {
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
              key={item._id}
              className="flex justify-between items-center border rounded-xl p-4 bg-white shadow-md"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-gray-700">
                  ${item.price} × {item.cartQuantity} = ${item.price * item.cartQuantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.cartQuantity, -1, item.quantity)
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-gray-900">{item.cartQuantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.cartQuantity, +1, item.quantity)
                  }
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
