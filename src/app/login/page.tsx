'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { login } from '@/redux/UserAuth/operations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

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
        toast.success('Вхід успішний');

        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/products');
        }
      } else {
        toast.error('Невірний логін або пароль');
      }
    } catch (error) {
      toast.error('Помилка при вході. Спробуй ще раз.');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4 text-red-600">Login</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 p-6 rounded shadow-md border">
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="border p-2 w-full rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="border p-2 w-full rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
