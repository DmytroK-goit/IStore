'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login, registerUser } from '@/redux/UserAuth/operations';

interface RegisterFormValues {
  email: string;
  password: string;
  name: string;
}

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const initialValues: RegisterFormValues = {
    email: '',
    password: '',
    name: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Incorrect email format').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long.')
      .required('Password is required'),
    name: Yup.string()
      .min(2, 'The name must be at least 2 characters long.')
      .required('Name is required'),
  });

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>,
  ) => {
    try {
      const resultAction = await dispatch(registerUser(values));
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Registration is successful');

        const loginResult = await dispatch(
          login({ email: values.email, password: values.password }),
        );

        if (login.fulfilled.match(loginResult)) {
          const userRole = loginResult.payload.data.user.role;
          router.push(userRole === 'admin' ? '/admin' : '/products');
        } else {
          router.push('/login');
        }
      } else {
      }
    } catch (error) {
      toast.error('Error while registering. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4 text-red-600">Register</h2>

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

            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" className="border p-2 w-full rounded" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
