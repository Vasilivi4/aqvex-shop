import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="pagination">
      <button className="page-btn nav-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ChevronLeft size={15} />
      </button>
      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`d${i}`} className="page-dots">…</span>
          : <button
              key={p}
              className={`page-btn${p === page ? ' active' : ''}`}
              onClick={() => onPageChange(p as number)}
            >{p}</button>
      )}
      <button className="page-btn nav-btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
