import { Search, ChevronDown, X } from 'lucide-react';
import { useProducts } from './useProducts';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import type { SortOption } from './types';
import './App.css';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'По популярности' },
  { value: 'price_asc', label: 'Цена: сначала низкая' },
  { value: 'price_desc', label: 'Цена: сначала высокая' },
  { value: 'rating', label: 'По рейтингу' },
];

export default function App() {
  const {
    products, loading, usingMock,
    search, handleSearch,
    sort, handleSort,
    page, handlePageChange,
    totalPages, totalCount,
    categories, category, handleCategory,
    selectedVolumes, handleVolumeChange,
  } = useProducts();

  const sortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'По популярности';
  const hasFilters = search || category;

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <img src="img/image.png" className="footer-img" />
        </div>
      </header>

      <main className="container main">

        {!loading && categories.length > 0 && (
          <div className="category-tabs">
            <button className={`cat-tab${!category ? ' active' : ''}`} onClick={() => handleCategory('')}>
              Все
            </button>
            {categories.map(c => (
              <button key={c} className={`cat-tab${category === c ? ' active' : ''}`} onClick={() => handleCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="search-row">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              className="search-input"
              placeholder="Поиск"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => handleSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="toolbar">
          <span className="count-label">
            {loading ? '…' : `${totalCount} товаров`}
            {hasFilters && !loading && (
              <button className="reset-filters" onClick={() => { handleSearch(''); handleCategory(''); }}>
                <X size={11} /> Сбросить
              </button>
            )}
          </span>
          <label className="sort-wrap">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <path d="M1 3h12M3 7h8M5 11h4" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="sort-label-text">{sortLabel}</span>
            <select className="sort-select" value={sort} onChange={e => handleSort(e.target.value as SortOption)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={13} className="sort-arrow" />
          </label>
        </div>

        {
          usingMock && (
            <div className="info-banner">
              ℹ Данные загружены локально — API недоступен при локальной разработке из-за CORS.
            </div>
          )
        }

        {
          loading ? (
            <div className="grid">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="#E5E7EB" strokeWidth="2" />
                <path d="M16 32s2-4 8-4 8 4 8 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                <circle cx="18" cy="20" r="2" fill="#9CA3AF" />
                <circle cx="30" cy="20" r="2" fill="#9CA3AF" />
              </svg>
              <p>Ничего не найдено</p>
              <span>Попробуйте изменить запрос или сбросить фильтры</span>
              <button className="btn-reset-empty" onClick={() => { handleSearch(''); handleCategory(''); }}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selectedVolumeId={selectedVolumes[p.id] ?? p.selected_volume_id}
                  onVolumeChange={vid => handleVolumeChange(p.id, vid)}
                />
              ))}
            </div>
          )
        }

        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </main >


      < footer className="footer" >
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="footer-logo-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 12L8 4L13 12H3Z" fill="white" opacity=".9" />
              </svg>
            </div>
            <img src="/img/image1.png" className="footer-img" />
            <img src="/img/image2.png" className="footer-img" />
            <span className="footer-copy">AQVEX © 2026 | Все права защищены</span>
          </div>
          <div className="payment-icons">
            <svg width="65" height="28" viewBox="0 0 65 28" fill="none" aria-label="Mastercard">
              <rect width="65" height="28" rx="5" fill="#F3F4F6" stroke="#E5E7EB" />
              <text x="33" y="18" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="14" fill="#990e0e">M</text>
              <text x="46" y="18" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="14" fill="#F79E1B">C</text>
              <circle cx="17" cy="14" r="7" fill="#EB001B" />
              <circle cx="25" cy="14" r="7" fill="#F79E1B" />
              <path d="M21 8.54a7 7 0 0 1 0 10.92A7 7 0 0 1 21 8.54z" fill="#FF5F00" />
            </svg>
            <svg width="50" height="28" viewBox="0 0 50 28" fill="none" aria-label="Visa">
              <rect width="50" height="28" rx="5" fill="#F3F4F6" stroke="#E5E7EB" />
              <text x="6" y="18" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="14" fill="#1A1F71">VISA</text>
            </svg>
            <svg width="52" height="28" viewBox="0 0 52 28" fill="none" aria-label="Apple Pay">
              <rect width="52" height="28" rx="5" fill="#F3F4F6" stroke="#E5E7EB" />
              <path d="M17 9.5c.55-.65.92-1.55.82-2.45-.8.03-1.77.53-2.34 1.18-.52.58-.97 1.5-.85 2.38.89.07 1.8-.44 2.37-1.11z" fill="#1C1C1E" />
              <path d="M17.8 10.8c-1.3-.08-2.42.74-3.04.74-.63 0-1.6-.7-2.64-.68-1.36.02-2.62.79-3.31 2.02-1.42 2.44-.37 6.06 1 8.06.67 1 1.47 2.1 2.53 2.06.99-.04 1.39-.65 2.59-.65s1.55.65 2.62.63c1.1-.02 1.78-1 2.45-2 .77-1.14 1.09-2.25 1.1-2.3-.03-.02-2.1-.81-2.12-3.22-.02-2.01 1.64-2.97 1.72-3.02-.95-1.4-2.42-1.55-2.9-1.64z" fill="#1C1C1E" />
              <text x="24" y="18" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="11" fill="#1C1C1E">Pay</text>
            </svg>
            <svg width="73" height="28" viewBox="0 0 73 28" fill="none" aria-label="Google Pay">
              <rect width="73" height="28" rx="5" fill="#F3F4F6" stroke="#E5E7EB" />
              <text x="6" y="18" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="500">
                <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
              </text>
              <text x="44" y="18" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="500" fill="#3C4043">Pay</text>
            </svg>
          </div>
        </div>
      </footer >
    </div >
  );
}
