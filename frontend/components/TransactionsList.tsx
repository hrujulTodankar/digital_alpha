"use client";

import { useState } from 'react';
import { Table, Column } from './Table/Table';
import { Modal } from './Modal/Modal';
import { Pagination } from './Pagination/Pagination';
import styles from './Table/Table.module.css';
import Link from 'next/link';

export function TransactionsList({ data, searchParams }: { data: any, searchParams: any }) {
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const columns: Column<any>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (tx) => new Date(tx.date).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })
    },
    {
      key: 'merchant',
      header: 'Merchant',
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'payment_method',
      header: 'Payment Method',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (tx) => {
        const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount);
        return <span className={tx.amount > 0 ? styles.amountNeg : styles.amountPos}>{formatted}</span>;
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx) => (
        <span className={`${styles.badge} ${tx.status === 'completed' ? styles.badgeCompleted : styles.badgePending}`}>
          {tx.status}
        </span>
      )
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        {(searchParams.category || searchParams.month) && (
          <Link href="/" style={{ background: 'var(--surface)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
            Clear Filters ✕
          </Link>
        )}
        {searchParams.category && <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>Category: {searchParams.category}</span>}
        {searchParams.month && <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>Month: {searchParams.month}</span>}
      </div>

      <Table 
        columns={columns} 
        data={data?.items || []} 
        isError={!data}
        onRowClick={(tx) => setSelectedTx(tx)}
      />
      
      {data && (
        <Pagination 
          currentPage={data.page} 
          totalPages={Math.ceil(data.total / data.size)} 
          totalItems={data.total} 
          pageSize={data.size}
          searchParams={searchParams}
        />
      )}

      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Details">
        {selectedTx && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--foreground)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#8c8f96' }}>Date</span>
              <span>{new Date(selectedTx.date).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#8c8f96' }}>Merchant</span>
              <span style={{ fontWeight: 500 }}>{selectedTx.merchant}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#8c8f96' }}>Payment Method</span>
              <span>{selectedTx.payment_method}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#8c8f96' }}>Category</span>
              <span>{selectedTx.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#8c8f96' }}>Status</span>
              <span style={{ textTransform: 'capitalize' }}>{selectedTx.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', fontSize: '1.25rem' }}>
              <span>Amount</span>
              <span className={selectedTx.amount > 0 ? styles.amountNeg : styles.amountPos}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedTx.amount)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
