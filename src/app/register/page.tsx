'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login, registerUser } from '@/redux/UserAuth/operations';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GridLoader } from 'react-spinners';
import { selectIsLoading } from '@/redux/UserAuth/selectors';

interface RegisterFormValues {
  email: string;
  password: string;
  name: string;
}

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useSelector(selectIsLoading);

  const initialValues: RegisterFormValues = { email: '', password: '', name: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Incorrect email format').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long.')
      .required('Password is required'),
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters long.')
      .required('Name is required'),
  });

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>,
  ) => {
    try {
      const resultAction = await dispatch(registerUser(values));

      if (registerUser.fulfilled.match(resultAction)) {
        const loginResult = await dispatch(
          login({ email: values.email, password: values.password }),
        );
        if (login.fulfilled.match(loginResult)) {
          const userRole = loginResult.payload.data.user.role;
          router.push(userRole === 'admin' ? '/admin' : '/products');
        } else {
          router.push('/login');
        }
      }
    } catch {
      toast.error('Error while registering. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const handleLoginRedirect = () => {
    router.push('/login');
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GridLoader color="#22c55e" />
      </div>
    );
  }
  return (
    <main className="relative min-h-screen flex items-center justify-center ">
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
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Register to IStore</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-1">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
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
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              <motion.button
                onClick={handleLoginRedirect}
                initial={{ x: -5 }}
                animate={{ x: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="bg-transparent border-2 border-emerald-600 text-emerald-600 font-semibold py-3 rounded-lg shadow-md hover:bg-emerald-600 hover:text-white transition disabled:opacity-50 cursor-pointer"
              >
                Login
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </main>
  );
}
