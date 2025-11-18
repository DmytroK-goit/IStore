'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addProduct, updateProduct } from '@/redux/Products/operations';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Product } from '@/types/product';

interface AddItemProps {
  product?: Product | null;
}

export default function AddItem({ product }: AddItemProps) {
  const dispatch = useDispatch<AppDispatch>();

  const categories = ['Laptop', 'Phone', 'Accessories', 'Power banks', 'Monitors', 'Electronics'];

  const initialValues = {
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    quantity: product?.quantity?.toString() || '',
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
      if (product) {
        await dispatch(updateProduct({ id: product._id, updatedData: formData }));
        resetForm();
      } else {
        await dispatch(addProduct(formData));
        resetForm();
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div
      className="w-3/4 p-6 shadow-lg rounded-xl bg-zinc-700 h-3/4 bg-cover bg-center sm:w-1/4 "
      style={{ backgroundImage: "url('/img/BG_add_item.webp')" }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {product ? 'Update Item' : 'Add Item'}
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-5">
            <div className="space-y-1">
              <label className="block font-medium text-gray-200">Name</label>
              <Field
                name="name"
                type="text"
                className="w-full bg-white/90 text-black border border-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-lg p-2 transition"
              />
              <ErrorMessage name="name" component="div" className="text-red-400 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-gray-200">Category</label>
              <Field
                name="category"
                as="select"
                className="w-full bg-white/90 text-black border border-zinc-400 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="text-red-400 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-gray-200">Price</label>
              <Field
                name="price"
                type="number"
                className="w-full bg-white/90 text-black border border-zinc-400 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition"
              />
              <ErrorMessage name="price" component="div" className="text-red-400 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-gray-200">Description</label>
              <Field
                name="description"
                as="textarea"
                rows={3}
                className="w-full bg-white/90 text-black border border-zinc-400 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition"
              />
              <ErrorMessage name="description" component="div" className="text-red-400 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-gray-200">Quantity</label>
              <Field
                name="quantity"
                type="number"
                className="w-full bg-white/90 text-black border border-zinc-400 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition"
              />
              <ErrorMessage name="quantity" component="div" className="text-red-400 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-gray-200">Image</label>
              <input
                type="file"
                name="img"
                onChange={(e) => setFieldValue('img', e.currentTarget.files?.[0] || null)}
                className="w-full bg-white/90 text-black border border-zinc-400 rounded-lg p-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-blue-600 file:text-white file:rounded file:hover:bg-blue-700 transition"
              />
              <ErrorMessage name="img" component="div" className="text-red-400 text-sm" />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition transform active:scale-95"
            >
              {product ? 'Update' : 'Add'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
