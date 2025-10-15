'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { login } from '@/redux/UserAuth/operations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const initialValues: LoginFormValues = { email: '', password: '' };

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
      const resultAction = await dispatch(login(values));

      if (login.fulfilled.match(resultAction)) {
        const userRole = resultAction.payload.data.user.role;
        router.push(userRole === 'admin' ? '/admin' : '/products');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch {
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
      <Link
        href="/"
        className="absolute top-4 left-4 text-emerald-400 font-semibold transition-all duration-300 hover:underline hover:text-emerald-300 hover:translate-x-1"
      >
        &larr; Back to Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-sm bg-black/60 p-8 rounded-2xl shadow-lg max-w-md w-full mx-4"
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Login to IStore</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-5">
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
                <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
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
            </Form>
          )}
        </Formik>

        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </motion.div>
    </main>
  );
}
