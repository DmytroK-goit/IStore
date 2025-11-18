'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchProducts } from '@/redux/Products/operations';
import { selectProducts } from '@/redux/Products/selectors';
import { Product } from '@/types/product';
import { addToCart as addToCartThunk } from '@/redux/Cart/operations';
import { motion } from 'framer-motion';
import { selectUser } from '@/redux/UserAuth/selectors';
import { Modal } from '@/components/modal/modal';

export default function ProductComponent() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts) as Product[];
  const user = useSelector(selectUser);
  const [isGuestOpenModal, setIsGuestOpenModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const product = products.find((p) => p._id === id) as Product | undefined;
  const outOfStock = product?.quantity === 0;

  if (!product) return <p className="p-6 text-gray-300">Product not found...</p>;

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await dispatch(addToCartThunk({ productId, quantity })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickGuest = () => setIsGuestOpenModal(true);

  const handleGoBack = () => {
    router.push(`/products?search=${search}&category=${category}&page=${page}`);
  };

  return (
    <motion.div
      layout
      className="min-h-screen w-full text-gray-100 flex items-center justify-center p-6"
    >
      <div className="w-full bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800 p-8 max-w-4xl">
        <button
          onClick={handleGoBack}
          className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition cursor-pointer"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-6 text-emerald-400">{product.name}</h1>

        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={product.img || '/img/no_item.jpg'}
            alt={product.name}
            className="w-full sm:w-80 h-80 object-cover rounded-xl border border-gray-700 shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => setIsOpen(true)}
          />

          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={product.name}>
            <img
              src={product.img || '/img/no_item.jpg'}
              alt={product.name}
              className="w-full h-full object-contain rounded-xl max-h-[80vh] mx-auto"
            />
          </Modal>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-400 mb-1">
                Category: <span className="text-gray-200">{product.category}</span>
              </p>
              <p className="text-2xl font-semibold text-emerald-300 mb-3">${product.price}</p>
              <p className="whitespace-pre-line text-gray-300 mb-6">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!user.email) handleClickGuest();
                  else handleAddToCart(product._id, 1);
                }}
                disabled={outOfStock && user.role !== 'Guest'}
                className={`cursor-pointer px-4 py-2 rounded-2xl font-semibold text-white transition ${
                  outOfStock && user.role !== 'Guest'
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {outOfStock && user.role !== 'Guest' ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isGuestOpenModal}
        onClose={() => setIsGuestOpenModal(false)}
        title="Guest Mode"
      >
        <p className="text-gray-300 mb-4">You need to log in to make purchases.</p>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setIsGuestOpenModal(false);
              router.push('/login');
            }}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-800 transition w-3/4 rounded-2xl text-center"
          >
            Log In
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
