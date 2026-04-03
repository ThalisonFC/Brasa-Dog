import { useContext } from 'react';
import { CustomerContext } from '@/context/CustomerContext';

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error('useCustomer deve ser usado dentro de CustomerProvider');
  }
  return ctx;
}
