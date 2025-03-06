import { useState, useEffect } from "react";

export interface Prices {
  [token: string]: number;
}

export interface TokenOption {
  symbol: string;
  icon: string;
}

interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

const PRICE_URL = "https://interview.switcheo.com/prices.json";

export const useTokenPrices = () => {
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(PRICE_URL);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = (await response.json()) as TokenPrice[];

        const { map: dedupedPrices } = data
          .filter((token) => token.price > 0)
          .reduce(
            (acc, token) => {
              const tokenDate = new Date(token.date);
              if (
                !acc.dates[token.currency] ||
                tokenDate > acc.dates[token.currency]
              ) {
                acc.dates[token.currency] = tokenDate;
                acc.map[token.currency] = token.price;
              }
              return acc;
            },
            { map: {} as Prices, dates: {} as Record<string, Date> }
          );

        setPrices(dedupedPrices);
      } catch (err) {
        console.error("Error fetching prices", err);
        setError("Failed to load token prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const tokenOptions: TokenOption[] = Object.keys(prices).map((token) => ({
    symbol: token,
    icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`,
  }));

  return { prices, tokenOptions, loading, error };
};
