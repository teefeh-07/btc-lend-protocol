import { useState, useEffect } from 'react';
import { fetchStxBalance } from '../services/api';

export const useBalance = (address: string | null) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }

    const loadBalance = async () => {
      setLoading(true);
      try {
        const bal = await fetchStxBalance(address);
        setBalance(bal);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, [address]);

  return { balance, loading };
};
