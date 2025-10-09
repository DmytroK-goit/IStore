'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchProducts } from '@/redux/Products/operations';
import {
  selectProductsLoading,
  selectProductsError,
  selectProducts,
} from '@/redux/Products/selectors';
import { Product } from '@/types/product';
import { addToCart as addToCartThunk } from '@/redux/Cart/operations';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { GridLoader } from 'react-spinners';
import { selectUser } from '@/redux/UserAuth/selectors';
import { Modal } from '@/components/modal/modal';

export default function ProductsPage() {
  const [isGuestOpenModal, setIsGuestOpenModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts) as Product[];
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const user = useSelector(selectUser);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 20;

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await dispatch(addToCartThunk({ productId, quantity })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickGuest = () => setIsGuestOpenModal(true);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">ISTORE</h2>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-[9999]"
          >
            <GridLoader color="#22c55e" />
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 w-full min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 w-full md:w-52"
        >
          <p className="text-2xl font-bold mb-2">Categories</p>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`cursor-pointer px-4 py-2 rounded-xl border font-medium 
              transition-all duration-300 ease-in-out transform
              ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white border-emerald-500 scale-105 shadow-md shadow-emerald-500/30'
                  : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white hover:scale-105 hover:shadow-md hover:shadow-emerald-500/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div>
          <motion.div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((product) => {
              const outOfStock = product.quantity === 0;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9 }}
                  style={{
                    backgroundImage: `url(${
                      outOfStock ? '/img/bg_no_item.webp' : '/img/bg_for_item.webp'
                    })`,
                  }}
                  className={`max-h-[420px] bg-cover bg-no-repeat rounded-2xl shadow-md border border-gray-800 
                    flex flex-col justify-between p-4 transition-all duration-300 ease-in-out transform
                    ${
                      outOfStock
                        ? 'bg-gray-900/60 opacity-70'
                        : 'bg-gray-900 hover:shadow-emerald-500/20 hover:-translate-y-1'
                    }`}
                >
                  <motion.div
                    className="relative flex w-full h-48 bg-gray-800 items-center justify-center rounded-xl mb-4 overflow-hidden cursor-pointer border border-gray-700 hover:border-emerald-500 transition-all duration-300"
                    onClick={() => router.push(`/products/${product._id}`)}
                    whileHover="hover"
                  >
                    <motion.img
                      src={product.img || '/img/no_item.webp'}
                      alt={product.name || 'No Image'}
                      loading="lazy"
                      className={`object-cover w-full h-full transition-opacity duration-300 ${
                        outOfStock ? 'opacity-50' : 'opacity-100'
                      }`}
                      variants={{
                        hover: { scale: 1.05 },
                      }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/50"
                      initial={{ opacity: 0, y: 30 }}
                      variants={{
                        hover: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <motion.p
                        className="text-white text-lg font-semibold tracking-wide"
                        initial={{ opacity: 0 }}
                        variants={{
                          hover: { opacity: 1 },
                        }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        Show Details
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  <h3 className="text-xl font-semibold text-emerald-300 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-1">Category: {product.category}</p>
                  <p className="font-bold text-lg text-gray-100 mb-1">${product.price}</p>

                  {outOfStock ? (
                    <p className="text-sm text-red-500 font-medium mb-2">Product is out of stock</p>
                  ) : product.quantity < 10 ? (
                    <p className="text-sm text-orange-400 font-medium mb-2">
                      Product is running out
                    </p>
                  ) : (
                    <div className="mb-2"></div>
                  )}

                  <button
                    onClick={() => {
                      const isGuest = user.email === '';
                      if (isGuest) {
                        handleClickGuest();
                      } else {
                        handleAddToCart(product._id, 1);
                      }
                    }}
                    disabled={outOfStock}
                    className={`w-full cursor-pointer py-2 rounded-xl font-semibold
                      transition-all duration-300 ease-in-out transform
                      ${
                        outOfStock
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 active:scale-95 shadow-md hover:shadow-emerald-500/40'
                      }`}
                  >
                    {outOfStock ? 'Out of Stock. Expected' : 'Add to Cart'}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={isGuestOpenModal}
        onClose={() => setIsGuestOpenModal(false)}
        title="Guest Mode"
      >
        <p className="text-gray-300 dark:text-gray-300 mb-4">
          You need to log in to make purchases.
        </p>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setIsGuestOpenModal(false);
              router.push('/login');
            }}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-800 transition w-3/4 rounded-2xl cursor-pointer text-center "
          >
            Log In
          </button>
        </div>
      </Modal>
    </div>
  );
}
