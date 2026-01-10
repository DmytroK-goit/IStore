'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { login } from '@/redux/UserAuth/operations';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { selectIsLoading } from '@/redux/UserAuth/selectors';
import { useState } from 'react';

type GifState = 'wait' | 'success' | 'error';

const gifs = {
  wait: 'gifts/load.gif',
  success: 'gifts/done.gif',
  error: 'gifts/wrong.gif',
};
interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const loading = useSelector(selectIsLoading);
  const dispatch = useDispatch<AppDispatch>();
  const initialValues: LoginFormValues = { email: '', password: '' };
  const [gifState, setGifState] = useState<GifState>('wait');

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>,
  ) => {
    try {
      setGifState('wait');

      const resultAction = await dispatch(login(values));

      if (login.fulfilled.match(resultAction)) {
        setGifState('success');

        const userRole = resultAction.payload.data.user.role;

        setTimeout(() => {
          router.push(userRole === 'admin' ? '/admin' : '/products');
        }, 2000);
      } else {
        setGifState('error');
        toast.error('Login failed. Please check your credentials.');
      }
    } catch {
      setGifState('error');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-sm bg-black/60 p-4 rounded-2xl shadow-lg max-w-3xl w-full mx-4 flex flex-col items-center justify-between"
      >
        <h2 className="text-5xl font-bold mb-4 text-yellow-400 text-center">Login to IStore</h2>
        <div className="flex justify-center gap-20">
          <div className="flex items-center">
            <img src={gifs[gifState]} alt="status animation" className="w-60 h-60 object-contain" />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-3 w-2/3">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-1">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-200 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <motion.button
                  initial={{ x: 5 }}
                  animate={{ x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </motion.button>
                <motion.button
                  onClick={handleRegisterRedirect}
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="bg-transparent border-2 border-emerald-600 text-emerald-600 font-semibold py-3 rounded-lg shadow-md hover:bg-emerald-600 hover:text-white transition disabled:opacity-50 cursor-pointer"
                >
                  Register
                </motion.button>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl 
              hover:bg-yellow-300 active:scale-95 transition-all duration-300 shadow-lg shadow-yellow-400/30 text-center"
                >
                  Back to Home
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </main>
  );
}
