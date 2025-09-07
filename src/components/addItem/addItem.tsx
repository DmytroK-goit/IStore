'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addProduct } from '@/redux/Products/operations';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddItem() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = ['Auto', 'Food', 'Health', 'Transport', 'Education', 'Electronics'];
  const initialValues = {
    name: '',
    category: '',
    price: '',
    description: '',
    quantity: '',
    img: null as File | null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    price: Yup.number()
      .typeError('Must be a number')
      .positive('Must be positive')
      .required('Required'),
    description: Yup.string().min(5, 'Too short').required('Required'),
    quantity: Yup.number().typeError('Must be a number').min(1, 'At least 1').required('Required'),
    img: Yup.mixed().nullable(),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      const formData: FormData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('price', values.price.toString());
      formData.append('description', values.description);
      formData.append('quantity', values.quantity.toString());
      if (values.img) formData.append('img', values.img);

      const resultAction = await dispatch(addProduct(formData));

      if (addProduct.fulfilled.match(resultAction)) {
        toast.success('Product added successfully');
        resetForm();
      } else {
        toast.error((resultAction.payload as string) || 'Failed to add product');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="p-6 shadow-lg rounded-xl bg-zinc-700">
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
              <Field name="name" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Field name="category" as="select" className="w-full border p-2 rounded bg-inherit">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Field>
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
              <label className="block mb-1 font-medium">Quantity</label>
              <Field name="quantity" type="number" className="w-full border p-2 rounded" />
              <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Image</label>
              <input
                type="file"
                name="img"
                onChange={(e) => setFieldValue('img', e.currentTarget.files?.[0] || null)}
                className="w-full border p-2 rounded"
              />
              <ErrorMessage name="img" component="div" className="text-red-500 text-sm" />
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
