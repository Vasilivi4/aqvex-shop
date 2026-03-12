import type { Product } from './types';
import { ShoppingCart } from 'lucide-react';

const IMAGE_BASE = 'https://ip-194-99-21-145-139178.vps.hosted-by-mvps.net/images/';

interface Props {
  product: Product;
  selectedVolumeId: string;
  onVolumeChange: (volumeId: string) => void;
}

function Stars({ rating, count }: { rating: number; count: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="rating-row">
      {/* Все 5 звёзд в одном span — нет разрывов между filled/empty */}
      {'★★★★★'.split('').map((star, i) => (
        <span
          key={i}
          className="star-icon"
          style={{ color: i < rounded ? '#1C6EEF' : '#D1D5DB' }}
        >
          {star}
        </span>
      ))}
      <span className="reviews-text">{count}</span>
    </div>
  );
}

function ProductSvg() {
  return (
    <svg viewBox="0 0 80 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:80,height:130}}>
      <rect x="18" y="6" width="44" height="118" rx="12" fill="#DDF0F7" stroke="#B8DCE9" strokeWidth="1.2"/>
      <rect x="22" y="16" width="36" height="60" rx="8" fill="#C4E4F2"/>
      <rect x="28" y="22" width="24" height="7" rx="3" fill="#9DCEE3"/>
      <text x="40" y="58" textAnchor="middle" fontSize="6.5" fill="#4A9ABF" fontWeight="700" fontFamily="sans-serif">AQVEX</text>
      <rect x="26" y="10" width="28" height="5" rx="2.5" fill="#B8DCE9"/>
      <circle cx="40" cy="105" r="9" fill="#C4E4F2" stroke="#9DCEE3" strokeWidth="1"/>
    </svg>
  );
}

export default function ProductCard({ product, selectedVolumeId, onVolumeChange }: Props) {
  const hasVolumes = product.volumes.length > 1;
  const selectedVolume = product.volumes.find(v => v.id === selectedVolumeId);
  const outOfStock = !product.in_stock;

  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : IMAGE_BASE + product.image)
    : null;

  return (
    <div className={`product-card${outOfStock ? ' out-of-stock' : ''}`}>
      {/* ИЗОБРАЖЕНИЕ */}
      <div className="card-image">
        {outOfStock && (
          <div className="stock-overlay">
            <span className="stock-overlay-text">Нет в наличии</span>
          </div>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="product-img"
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
            }}
          />
        ) : null}
        <div style={imageUrl ? {display:'none'} : {}}>
          <ProductSvg />
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div className="card-body">
        {/* Цены: зачёркнутая → текущая → бейдж (как в макете) */}
        <div className="prices">
          <span className="old-price">{product.old_price} {product.currency}</span>
          <span className="price">{product.price} {product.currency}</span>
          <span className="discount-badge">-{product.discount_percent}%</span>
        </div>

        <h3 className="product-name">{product.name}</h3>

        <Stars rating={product.rating} count={product.reviews_count} />

        {/* В наличии · Категория */}
        <div className="meta-row">
          {product.in_stock ? (
            <span className="in-stock">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="6.5" r="6" stroke="#16A34A"/>
                <path d="M4 6.5L5.8 8.3L9 5" stroke="#16A34A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              В наличии
            </span>
          ) : (
            <span className="not-in-stock">Нет в наличии</span>
          )}
          <span className="meta-sep">·</span>
          <span className="category-tag">{product.category}</span>
        </div>

        {/* Объём + кнопка */}
        <div className="card-footer">
          {hasVolumes ? (
            <select
              className="volume-select"
              value={selectedVolumeId}
              onChange={e => onVolumeChange(e.target.value)}
              disabled={outOfStock}
            >
              {product.volumes.map(v => (
                <option key={v.id} value={v.id} disabled={!v.in_stock}>
                  {v.label}{!v.in_stock ? ' ✕' : ''}
                </option>
              ))}
            </select>
          ) : <div />}
          <button className="btn-cart" disabled={!selectedVolume?.in_stock || outOfStock}>
            <ShoppingCart size={14} />
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
