'use client';
import { JSX, useEffect, useState } from 'react';
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
import { BatteryFull, Keyboard, Laptop, Monitor, Package, Plug, Smartphone } from 'lucide-react';
import { getFavorites, toggleFavorite } from '@/service/favorites';

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
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const limit = 20;

  const categoryIcons: Record<string, JSX.Element> = {
    All: <Package size={18} />,
    Phone: <Smartphone size={18} />,
    Laptop: <Laptop size={18} />,
    Monitors: <Monitor size={18} />,
    Accessories: <Keyboard size={18} />,
    'Power banks': <BatteryFull size={18} />,
    Electronics: <Plug size={18} />,
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setFavoriteIds(getFavorites());
  }, []);

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
  const handleClickFavorite = (productId: string) => {
    const updated = toggleFavorite(productId);
    setFavoriteIds(updated);
  };

  return (
    <div className="p-6">
      <h2 className="text-5xl font-bold mb-6 text-emerald-600 text-center">ISTORE</h2>

      <div className="mb-6 max-w-xl flex mx-auto">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md shadow-emerald-500/20 transition"
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium
    transition-all duration-300 ease-in-out transform cursor-pointer
    ${selectedCategory === cat
                      ? 'bg-emerald-800 text-white border-emerald-900 scale-105 shadow-md'
                      : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  {categoryIcons[cat] ?? <Package size={18} />}
                  <span>{cat}</span>
                </button>
              ))}
          </div>
        </motion.div>

        <div>
          <motion.div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {paginatedProducts.map((product) => {
              const outOfStock = product.quantity === 0;

              return (
                <motion.div
                  key={product._id}
                  style={{
                    backgroundImage: `url(${outOfStock ? '/img/bg_no_item.webp' : '/img/bg_for_item.webp'
                      })`,
                  }}
                  className={`relative max-h-[420px] bg-cover bg-no-repeat rounded-2xl shadow-md border border-gray-800 
                    flex flex-col justify-between p-6 transition-all duration-300 ease-in-out transform
                    
                    ${outOfStock
                      ? 'bg-gray-900/60 opacity-70'
                      : 'bg-gray-900 hover:shadow-emerald-500/20 hover:-translate-y-1'
                    }`}
                >
                  <button
                    onClick={() => handleClickFavorite(product._id)}
                    type="button"
                    className="absolute top-2 right-2 z-10"
                  >
                    <svg
                      className={`w-6 h-6 transition-colors duration-300 cursor-pointer
      ${favoriteIds.includes(product._id) ? 'fill-red-800' : 'fill-gray-300 hover:fill-red-400'}`}
                    >
                      <use href="sprite.svg#icon-hart"></use>
                    </svg>
                  </button>
                  <div
                    className="group relative flex w-full h-48 bg-gray-800 items-center justify-center rounded-xl mb-4 overflow-hidden cursor-pointer border border-gray-700 hover:border-emerald-500 transition-all duration-300"
                    onClick={() =>
                      router.push(
                        `/products/${product._id}?search=${searchQuery}&category=${selectedCategory}&page=${page}`,
                      )
                    }
                  >
                    <div className="relative w-full h-full bg-neutral-200">
                      <img
                        src={product.img || '/img/no_item.webp'}
                        alt={product.name || 'No Image'}
                        loading="lazy"
                        className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-110 ${outOfStock ? 'opacity-50' : 'opacity-0'
                          }`}
                        onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-500"></div>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-center translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <span className="text-white text-lg font-medium py-3">Show more</span>
                    </div>
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
                      ${outOfStock
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
