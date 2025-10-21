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
import { Pagination } from '@/components/pagination/pagination';
import { useSearchParams } from 'next/navigation';

export default function ProductsComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const products = useSelector(selectProducts) as Product[];
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const user = useSelector(selectUser);
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [isGuestOpenModal, setIsGuestOpenModal] = useState(false);

  const limit = 12;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products
    .filter((p) => p.category !== 'Education')
    .filter((p) => (selectedCategory === 'All' ? true : p.category === selectedCategory))
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);
  const categories = ['All', ...new Set(products.map((p) => p.category))];

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
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">ISTORE</h2>

      <div className="mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

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
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {categories
              .filter((cat) => cat !== 'Education')
              .map((cat) => (
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
          </div>
        </motion.div>

        <div>
          <motion.div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {paginatedProducts.map((product) => {
              const outOfStock = product.quantity === 0;

              return (
                <motion.div
                  key={product._id}
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
                  <div
                    className="relative flex w-full h-48 bg-gray-800 items-center justify-center rounded-xl mb-4 overflow-hidden cursor-pointer border border-gray-700 hover:border-emerald-500 transition-all duration-300"
                    onClick={() =>
                      router.push(
                        `/products/${product._id}?search=${searchQuery}&category=${selectedCategory}&page=${page}`,
                      )
                    }
                  >
                    <img
                      src={product.img || '/img/no_item.webp'}
                      alt={product.name || 'No Image'}
                      loading="lazy"
                      className={`object-cover w-full h-full transition-opacity duration-300 ${
                        outOfStock ? 'opacity-50' : 'opacity-100'
                      }`}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-emerald-300 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-1">Category: {product.category}</p>
                  <p className="font-bold text-lg text-gray-100 mb-1">${product.price}</p>

                  {outOfStock ? (
                    <p className="text-sm text-red-500 font-medium mb-2">Out of stock</p>
                  ) : product.quantity < 10 ? (
                    <p className="text-sm text-orange-400 font-medium mb-2">Running out</p>
                  ) : (
                    <div className="mb-2"></div>
                  )}

                  <button
                    onClick={() => {
                      if (!user.email) handleClickGuest();
                      else handleAddToCart(product._id, 1);
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
                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
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
        <p className="text-gray-300 mb-4">You need to log in to make purchases.</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setIsGuestOpenModal(false);
              router.push('/login');
            }}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-800 transition w-3/4 rounded-2xl"
          >
            Log In
          </button>
        </div>
      </Modal>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}
