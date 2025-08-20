'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function AddItem() {
  const initialValues = {
    nameItem: '',
    category: '',
    price: '',
    description: '',
    amount: '',
    image: null as File | null,
  };

  const validationSchema = Yup.object({
    nameItem: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    price: Yup.number()
      .typeError('Must be a number')
      .positive('Must be positive')
      .required('Required'),
    description: Yup.string().min(5, 'Too short').required('Required'),
    amount: Yup.number().typeError('Must be a number').min(1, 'At least 1').required('Required'),
    image: Yup.mixed().required('Image is required'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log('Form data:', values);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Item</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Field name="nameItem" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage name="nameItem" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Field name="category" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <Field name="price" type="number" className="w-full border p-2 rounded" />
              <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Field
                name="description"
                as="textarea"
                rows={3}
                className="w-full border p-2 rounded"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Amount</label>
              <Field name="amount" type="number" className="w-full border p-2 rounded" />
              <ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Image</label>
              <input
                type="file"
                name="image"
                onChange={(e) => setFieldValue('image', e.currentTarget.files?.[0] || null)}
                className="w-full border p-2 rounded"
              />
              <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
