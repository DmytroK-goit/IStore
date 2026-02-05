'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchProducts } from '@/redux/Products/operations';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';
import { fetchCart, removeFromCart } from '@/redux/Cart/operations';
import { selectCartItems } from '@/redux/Cart/selectors';
import { selectProducts } from '@/redux/Products/selectors';
import { CartItem, setCartItemQuantity } from '@/redux/Cart/sliсe';
import { createOrder } from '@/redux/Order/operations';
import PaymentModal from '@/components/paymentModal/paymentModal';
import { selectIsLoading, selectUser } from '@/redux/UserAuth/selectors';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GridLoader } from 'react-spinners';

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

export interface DetailedCartItem extends Product {
  cartQuantity: number;
  cartItemId: string;
}

export default function CartPage() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const isLoggedIn = Boolean(user?.email !== '');
  const products = useSelector(selectProducts);
  const dispatch = useDispatch<AppDispatch>();
  const cart: CartItem[] = useSelector(selectCartItems);
  const [detailedItems, setDetailedItems] = useState<DetailedCartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<SoldAddress | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProducts());
    dispatch(fetchCart());
  }, [dispatch, products]);

  useEffect(() => {
    if (!products || cart.length === 0) {
      setDetailedItems([]);
      return;
    }

    const updatedDetailed = cart
      .map((ci) => {
        const product = products.find((p) => p._id === ci.productId);
        if (!product) return null;
        return {
          ...product,
          cartQuantity: ci.quantity,
          cartItemId: ci._id,
        };
      })
      .filter(Boolean);

    setDetailedItems(updatedDetailed as DetailedCartItem[]);
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
    phone: Yup.string()
      .matches(
        /^\+?38\s?\(?0\d{2}\)?\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/,
        'Enter a valid Ukrainian phone number (e.g. +38(097)9638775)',
      )
      .required('Required'),
    city: Yup.string().required('Required'),
    street: Yup.string().required('Required'),
    house: Yup.string().required('Required'),
    apartment: Yup.string(),
    comment: Yup.string(),
  });

  const handleSubmit = (values: SoldAddress, { resetForm }: { resetForm: () => void }) => {
    const cleanedPhone = values.phone.replace(/\D/g, '');
    setPendingValues({ ...values, phone: cleanedPhone });
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;

    const items = cart.map((ci) => ({
      productId: ci.productId,
      quantity: ci.quantity,
    }));
    await dispatch(createOrder({ address: pendingValues, items }));
    await dispatch(fetchCart());

    setIsModalOpen(false);
    setPendingValues(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingValues(null);
  };

  if (!cart || cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-10 text-center text-gray-300"
      >
        <h2 className="text-3xl font-bold mb-4 text-yellow-400">Your Cart</h2>
        <p className="text-gray-400">Your cart is currently empty.</p>
      </motion.div>
    );
  }

  return (
    <div className='rounded-3xl border border-gray-700 bg-stone-900/80 shadow-lg max-w-8xl  shadow-green-300/70'>
      <h2 className="text-3xl text-center font-bold mb-6 text-yellow-400">Your Cart</h2>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-200">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            {detailedItems.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center border border-gray-700 rounded-2xl shadow-md bg-gradient-to-br from-gray-500 via-gray-900 to-gray-500 p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.img || '/img/no_item.jpg'}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-yellow-300">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <p className="text-gray-300">
                      ${item.price} × {item.cartQuantity}{' '}
                      <span className="text-yellow-400 font-semibold">
                        = ${item.price * item.cartQuantity}
                      </span>
                    </p>
                    <button
                      className="mt-2 text-sm px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition cursor-pointer"
                      onClick={() => dispatch(removeFromCart(item.cartItemId))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.cartQuantity, -1, item.quantity)
                    }
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 border cursor-pointer border-gray-600"
                  >
                    -
                  </button>
                  <span className="text-yellow-400 font-semibold">{item.cartQuantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.cartQuantity, +1, item.quantity)
                    }
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 border cursor-pointer border-gray-600"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <p className="text-2xl font-bold text-yellow-400">
              Total: <span className="text-white">${total.toFixed(2)}</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-gray-700 rounded-2xl shadow-md bg-gradient-to-br from-gray-500 via-gray-900 to-gray-500 p-4 "
        >
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Delivery Details</h2>
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
              <Form className="flex flex-col gap-1 justify-center">
                {['name', 'surname', 'phone', 'city', 'street', 'house', 'apartment', 'comment'].map(
                  (field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium text-gray-400 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Field
                        as={field === 'comment' ? 'textarea' : 'input'}
                        id={field}
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      />
                      <ErrorMessage name={field} component="div" className="text-red-400 text-sm" />
                    </div>
                  ),
                )}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex justify-center mt-4 w-1/3 p-2 rounded-lg font-semibold bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition disabled:opacity-50 cursor-pointer text-lg text-center"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </motion.button>
              </Form>
            )}
          </Formik>

          {isModalOpen && <PaymentModal onConfirm={handleConfirm} onCancel={handleCancel} />}
        </motion.div>
      </div></div>
  );
}
