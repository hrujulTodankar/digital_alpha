import Link from 'next/link';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, totalItems, pageSize, searchParams }: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams || {});
    params.set('page', page.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Showing {totalItems > 0 ? start : 0} to {end} of {totalItems} results
      </div>
      <div className={styles.controls}>
        <Link 
          href={buildUrl(currentPage - 1)} 
          className={`${styles.btn} ${currentPage <= 1 ? styles.disabled : ''}`}
        >
          Previous
        </Link>
        <Link 
          href={buildUrl(currentPage + 1)} 
          className={`${styles.btn} ${currentPage >= totalPages ? styles.disabled : ''}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
