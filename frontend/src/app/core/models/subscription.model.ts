export interface Subscription {
  id: number;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  category: 'entertainment' | 'software' | 'utilities' | 'lifestyle';
  nextPaymentDate: string;
  color: string;
  icon: string;
  status: 'active' | 'paused';
  createdAt?: string;
}

export interface SubscriptionStats {
  totalMonthly: number;
  count: number;
  annualProjection: number;
}

// Categorias disponibles para el formulario
export const CATEGORIES: { value: Subscription['category']; label: string; icon: string }[] = [
  { value: 'entertainment', label: 'Entretenimiento', icon: 'movie' },
  { value: 'software', label: 'Software', icon: 'code' },
  { value: 'utilities', label: 'Utilidades', icon: 'build' },
  { value: 'lifestyle', label: 'Estilo de vida', icon: 'favorite' },
];

export enum PriceSort {
  None = 'none',
  Asc = 'asc',
  Desc = 'desc'
}