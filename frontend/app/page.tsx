import { RewardsCatalogue } from '@/components/RewardsCatalogue/RewardsCatalogue';
import { CategoryChart } from '@/components/Charts/CategoryChart';
import { MonthlyChart } from '@/components/Charts/MonthlyChart';
import { TransactionsList } from '@/components/TransactionsList';

async function getData(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://digital-alpha-c0si.onrender.com";
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`[Data Fetch Error] ${endpoint} returned ${res.status} ${res.statusText}`);
      return { error: `HTTP ${res.status}: ${res.statusText}` };
    }
    return res.json();
  } catch (error: any) { 
    console.error(`[Network Error] Failed to fetch ${endpoint}:`, error);
    return { error: `Network Error: ${error.message || 'Unknown'}` }; 
  }
}

export default async function TransactionsDashboard({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const size = 20;
  
  const queryParams = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (resolvedParams.category) queryParams.append('category', resolvedParams.category);
  if (resolvedParams.month) queryParams.append('month', resolvedParams.month);

  const [txData, coinsData, rewardsData, catData, monthData] = await Promise.all([
    getData(`/api/transactions?${queryParams.toString()}`),
    getData('/api/coins'),
    getData('/api/rewards'),
    getData('/api/analytics/category'),
    getData('/api/analytics/monthly'),
  ]);

  return (
    <main className="dashboard-container">
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'white' }}>Spend Analytics & Rewards</h1>
        <p style={{ color: '#8c8f96' }}>View your spending and redeem your coins.</p>
      </header>

      {rewardsData && coinsData && (
        <RewardsCatalogue rewards={rewardsData} initialBalance={coinsData.coin_balance} />
      )}

      <div className="charts-row">
        {catData && <CategoryChart data={catData} />}
        {monthData && <MonthlyChart data={monthData} />}
      </div>

      {txData?.error ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--border-radius)', border: '1px solid #ef4444' }}>
          <h3>API Connection Failed</h3>
          <p>{txData.error}</p>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: '#8c8f96' }}>If you just deployed, the backend might be cold-starting. Wait 60 seconds and refresh.</p>
        </div>
      ) : !txData || !txData.items || txData.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#8c8f96', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border)' }}>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or checking back later.</p>
        </div>
      ) : (
        <TransactionsList data={txData} searchParams={resolvedParams} />
      )}
    </main>
  );
}
