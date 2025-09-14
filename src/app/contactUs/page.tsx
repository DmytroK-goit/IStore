'use client';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addContactUsMessage } from '@/redux/ContactUs/operations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export default function ContactUs() {
  const dispatch = useDispatch<AppDispatch>();
  const initialValues: ContactFormValues = { name: '', email: '', message: '' };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    message: Yup.string().required('Message is required'),
  });

  const handleSubmit = async (
    values: ContactFormValues,
    { resetForm }: FormikHelpers<ContactFormValues>,
  ) => {
    try {
      const resultAction = await dispatch(addContactUsMessage(values));
      if (addContactUsMessage.fulfilled.match(resultAction)) {
        toast.success('Message sent successfully!');
        resetForm();
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white opacity-90 rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Contact Us</h2>
      <p className="text-gray-600 mb-6">
        We would love to hear from you! Please reach out with any questions or feedback.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Field
                id="name"
                name="name"
                placeholder="Your Name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <Field
                as="textarea"
                id="message"
                name="message"
                rows={4}
                placeholder="Your message..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              />
              <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Message
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
