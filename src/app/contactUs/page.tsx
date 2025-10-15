'use client';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addContactUsMessage } from '@/redux/ContactUs/operations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 p-8 bg-gray-950 bg-opacity-90 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg text-gray-100"
    >
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <h2 className="text-3xl font-bold mb-3 text-yellow-400">Contact Us</h2>
      <p className="text-gray-400 mb-8">
        Send us your message, and we&apos;ll get back to you soon.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <Field
                id="name"
                name="name"
                placeholder="Your Name"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
              <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
              <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <Field
                as="textarea"
                id="message"
                name="message"
                rows={4}
                placeholder="Your message..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
              <ErrorMessage name="message" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-lg font-semibold bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>

              <motion.button
                type="reset"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-lg font-semibold border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-gray-900 transition"
              >
                Clear
              </motion.button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
