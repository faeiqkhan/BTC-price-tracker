export interface CoinMarketData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
}

export interface CoinQuantityData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  quantity: number;
  roi: number;
  longTermScore: number;
  marketCap: number;
  volume: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
}

let cachedTopCoins: CoinMarketData[] | null = null;

export async function getTopCoins(): Promise<CoinMarketData[]> {
  if (cachedTopCoins) {
    return cachedTopCoins;
  }

  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d');
  if (!response.ok) {
    throw new Error('Failed to fetch top coins');
  }
  const data: CoinMarketData[] = await response.json();
  cachedTopCoins = data;
  return cachedTopCoins;
}

function calculateLongTermScore(coin: CoinMarketData): number {
  // Normalize market cap (higher is better)
  const marketCapScore = Math.log10(coin.market_cap) / 12; // Normalize to 0-1 range

  // Normalize volume (higher is better)
  const volumeScore = Math.log10(coin.total_volume) / 10;

  // Price stability score (less volatility is better)
  const volatilityScore = 1 - (Math.abs(coin.price_change_percentage_24h) / 100);
  
  // Growth potential score (positive price changes are good)
  const growthScore = (
    (coin.price_change_percentage_24h > 0 ? 1 : 0) * 0.3 +
    (coin.price_change_percentage_7d_in_currency > 0 ? 1 : 0) * 0.3 +
    (coin.price_change_percentage_30d_in_currency > 0 ? 1 : 0) * 0.4
  );

  // Weighted combination of all factors
  return (
    marketCapScore * 0.3 +      // Market cap weight
    volumeScore * 0.2 +         // Volume weight
    volatilityScore * 0.2 +     // Stability weight
    growthScore * 0.3           // Growth weight
  );
}

export async function findBestDeals(inrAmount: number): Promise<CoinQuantityData[]> {
  try {
    const topCoins = await getTopCoins();
    const coinQuantities: CoinQuantityData[] = topCoins.map((coin) => {
      const quantity = inrAmount / coin.current_price;
      const roi = 1 / coin.current_price;
      const longTermScore = calculateLongTermScore(coin);

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: coin.image,
        price: coin.current_price,
        quantity: quantity,
        roi: roi,
        longTermScore: longTermScore,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        priceChange24h: coin.price_change_percentage_24h,
        priceChange7d: coin.price_change_percentage_7d_in_currency,
        priceChange30d: coin.price_change_percentage_30d_in_currency
      };
    });

    // Sort by long-term score (highest first)
    coinQuantities.sort((a, b) => b.longTermScore - a.longTermScore);
    return coinQuantities.slice(0, 10);
  } catch (error) {
    console.error('Error finding best deals:', error);
    return [];
  }
} 