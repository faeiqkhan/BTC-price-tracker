import { CoinQuantityData } from './coinApi';

interface OffersTableProps {
  offers: CoinQuantityData[];
}

export default function OffersTable({ offers }: OffersTableProps) {
  return (
    <div className="mt-8 space-y-4">
      {offers.map((coin) => (
        <div
          key={coin.id}
          className="flex items-center justify-between px-8 py-6 rounded-xl bg-blue-900 hover:bg-blue-800 transition-all"
        >
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.symbol} className="w-10 h-10 rounded-full bg-white/10" />
            <div>
              <div className="text-xl font-bold tracking-wide">{coin.name} <span className="text-white/50 text-base">({coin.symbol})</span></div>
              <div className="text-sm text-white/50">₹{coin.price.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-mono text-purple-300 block">{coin.quantity.toFixed(6)}</span>
            <div className="text-xs text-white/60 space-y-1">
              <div>Long-term Score: {(coin.longTermScore * 100).toFixed(1)}%</div>
              <div>24h: {coin.priceChange24h.toFixed(1)}%</div>
              <div>7d: {coin.priceChange7d.toFixed(1)}%</div>
              <div>30d: {coin.priceChange30d.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 