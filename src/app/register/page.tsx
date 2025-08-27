'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login, registerUser } from '@/redux/UserAuth/operations';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RegisterFormValues {
  email: string;
  password: string;
  name: string;
}

// Типізація результатів dispatch
type RegisterResult = Awaited<ReturnType<typeof registerUser>>;
type LoginResult = Awaited<ReturnType<typeof login>>;

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();

  const initialValues: RegisterFormValues = {
    email: '',
    password: '',
    name: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Неправильний формат email').required('Email обов’язковий'),
    password: Yup.string()
      .min(6, 'Пароль має бути не менше 6 символів')
      .required('Пароль обов’язковий'),
    name: Yup.string().min(2, 'Ім’я має бути не менше 2 символів').required('Ім’я обов’язкове'),
  });

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>,
  ) => {
    try {
      const resultRegister: RegisterResult = await dispatch(registerUser(values));

      if (resultRegister.meta.requestStatus === 'fulfilled') {
        toast.success('Реєстрація успішна');

        const loginResult: LoginResult = await dispatch(
          login({ email: values.email, password: values.password }),
        );

        if (loginResult.meta.requestStatus === 'fulfilled') {
          const userRole = loginResult.payload.data.user.role;
          router.push(userRole === 'admin' ? '/admin' : '/products');
        } else {
          toast.error('Не вдалося увійти після реєстрації. Спробуйте увійти вручну.');
          router.push('/login');
        }
      } else {
        toast.error('Не вдалося зареєструватися. Спробуйте ще раз.');
      }
    } catch (error) {
      toast.error('Помилка при реєстрації. Спробуйте ще раз.');
      console.error('Registration error:', error);
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
