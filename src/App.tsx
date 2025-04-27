import { useState, useEffect } from 'react';
import AmountInput from './AmountInput';
import OffersTable from './OffersTable';
import { findBestDeals, CoinQuantityData } from './coinApi';

function App() {
  const [amount, setAmount] = useState('1000');
  const [offers, setOffers] = useState<CoinQuantityData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const amt = parseFloat(amount);
      if (!isNaN(amt) && amt > 0) {
        const coins = await findBestDeals(amt);
        setOffers(coins);
      } else {
        setOffers([]);
      }
      setLoading(false);
    };
    fetchOffers();
  }, [amount]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 ">
      <h1 className="uppercase text-6xl text-center font-bold bg-gradient-to-br from-purple-600 to-sky-400 bg-clip-text text-transparent from-30%">Find Best Crypto to Invest</h1>
      <div className="flex justify-center mt-6">
        <AmountInput 
          value={amount} 
          onChange={e => setAmount(e.target.value)}/>
      </div>
      {loading ? (
        <div className="text-center text-lg text-white/60 mt-8">Loading...</div>
      ) : (
        <OffersTable offers={offers} />
      )}
    </main>
  )
}

export default App
