import { useState, useEffect, useMemo } from 'react';
import type { Product, SortOption } from './types';
import { mockProducts } from './mockData';
import { useDebounce } from './useDebounce';

const API_URL = '/api/v1/products';
const ITEMS_PER_PAGE = 8;

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  // UI state
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('popularity');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('');
  const [selectedVolumes, setSelectedVolumes] = useState<Record<string, string>>({});

  // Debounced search — фильтрация не на каждый символ, а через 300мс после остановки
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const load = async () => {
      let products: Product[] = [];
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        products = json?.data?.products ?? json?.products ?? json ?? [];
        if (!Array.isArray(products) || products.length === 0) throw new Error('empty');
      } catch (e) {
        console.warn('API недоступен, используем демо-данные:', e);
        products = mockProducts;
        setUsingMock(true);
      }
      const volumes: Record<string, string> = {};
      products.forEach(p => { volumes[p.id] = p.selected_volume_id; });
      setAllProducts(products);
      setSelectedVolumes(volumes);
      setLoading(false);
    };
    load();
  }, []);

  // Список уникальных категорий из данных
  const categories = useMemo(() => {
    const set = new Set(allProducts.map(p => p.category));
    return Array.from(set).sort();
  }, [allProducts]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    let result = [...allProducts];

    if (q) result = result.filter(p => p.name.toLowerCase().includes(q));
    if (category) result = result.filter(p => p.category === category);

    switch (sort) {
      case 'popularity': result.sort((a, b) => b.reviews_count - a.reviews_count); break;
      case 'price_asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
    }
    return result;
  }, [allProducts, debouncedSearch, sort, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleSort = (val: SortOption) => { setSort(val); setPage(1); };
  const handleCategory = (val: string) => { setCategory(val); setPage(1); };
  const handleVolumeChange = (id: string, volumeId: string) =>
    setSelectedVolumes(prev => ({ ...prev, [id]: volumeId }));

  const handlePageChange = (p: number) => {
    setPage(p);
    // Скролл вверх при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    products: paginated,
    loading, usingMock,
    search, handleSearch,
    sort, handleSort,
    page: safePage, handlePageChange,
    totalPages,
    totalCount: filtered.length,
    categories, category, handleCategory,
    selectedVolumes, handleVolumeChange,
  };
}
