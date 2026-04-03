import type { Addon, BreadOption, SausageOption } from '@/types';

export function calculateUnitPrice(
  basePrice: number,
  bread: BreadOption,
  sausage: SausageOption,
  addons: Addon[]
): number {
  const addonsSum = addons.reduce((sum, a) => sum + a.price, 0);
  return basePrice + bread.priceModifier + sausage.priceModifier + addonsSum;
}
