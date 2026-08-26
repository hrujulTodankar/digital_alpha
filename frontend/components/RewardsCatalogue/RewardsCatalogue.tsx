"use client";

import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { useRouter } from 'next/navigation';

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost_in_coins: number;
}

interface Props {
  rewards: Reward[];
  initialBalance: number;
}

export function RewardsCatalogue({ rewards, initialBalance }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const router = useRouter();

  const handleRedeem = async () => {
    if (!selectedReward) return;
    
    // Optimistic update
    const previousBalance = balance;
    setBalance(balance - selectedReward.cost_in_coins);
    setIsRedeeming(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://digital-alpha-c0si.onrender.com";
      const res = await fetch(`${API_BASE_URL}/api/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: '00000000-0000-0000-0000-000000000000', reward_id: selectedReward.id })
      });

      if (!res.ok) throw new Error('Redemption failed');
      
      setSelectedReward(null); // Close modal
      router.refresh(); // Refresh server data
    } catch (error) {
      // Rollback
      setBalance(previousBalance);
      alert('Failed to redeem reward. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--foreground)' }}>Rewards Catalogue</h2>
        <div style={{ background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#8c8f96' }}>Available Coins:</span>
          <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '1.25rem' }}>🪙 {balance}</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {rewards.map(reward => (
          <div key={reward.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ margin: 0, color: 'var(--foreground)' }}>{reward.name}</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#8c8f96', flex: 1 }}>{reward.description}</p>
            <button 
              onClick={() => setSelectedReward(reward)}
              disabled={balance < reward.cost_in_coins}
              style={{
                marginTop: '1rem',
                padding: '0.5rem',
                background: balance >= reward.cost_in_coins ? 'var(--primary)' : 'var(--border)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: balance >= reward.cost_in_coins ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s ease'
              }}
            >
              Redeem for {reward.cost_in_coins} 🪙
            </button>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedReward} 
        onClose={() => !isRedeeming && setSelectedReward(null)} 
        title="Confirm Redemption"
      >
        {selectedReward && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--foreground)' }}>
            <p style={{ margin: 0 }}>Are you sure you want to redeem <strong>{selectedReward.name}</strong>?</p>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Cost:</span>
              <span style={{ color: 'var(--warning)', fontWeight: 600 }}>- {selectedReward.cost_in_coins} 🪙</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => setSelectedReward(null)} disabled={isRedeeming} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleRedeem} disabled={isRedeeming} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', color: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                {isRedeeming ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
