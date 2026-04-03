export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  category: ProductCategory;
  available: boolean;
  featured: boolean;
  customizationConfig: ProductCustomizationConfig;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 'classicos' | 'especiais' | 'combos' | 'bebidas';

export interface BreadOption {
  id: string;
  label: string;
  priceModifier: number;
}

export interface SausageOption {
  id: string;
  label: string;
  priceModifier: number;
}

export interface Addon {
  id: string;
  label: string;
  price: number;
  available: boolean;
}

export interface CustomizationOptions {
  breads: BreadOption[];
  sausages: SausageOption[];
  addons: Addon[];
}

export interface ProductBreadOption extends BreadOption {
  available: boolean;
}

export interface ProductSausageOption extends SausageOption {
  available: boolean;
}

export interface ProductCustomizationConfig {
  breads: ProductBreadOption[];
  sausages: ProductSausageOption[];
  addons: Addon[];
}

export interface CartItemCustomization {
  bread: BreadOption;
  sausage: SausageOption;
  addons: Addon[];
  notes: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  customization: CartItemCustomization;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; delta: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState };

export interface Order {
  id: string;
  items: CartItem[];
  subtotalPrice: number;
  deliveryFee: number;
  totalPrice: number;
  deliveryMode: 'entrega' | 'retirada';
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  channel: 'whatsapp';
  createdAt: string;
  whatsappMessageSent: boolean;
}

export interface SiteContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    backgroundImageUrl: string;
  };
  about: {
    title: string;
    description: string;
    imageUrl: string;
  };
  contact: {
    whatsappNumber: string;
    address: string;
    openingHours: string;
    instagram: string;
  };
  footer: {
    tagline: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager';
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}

export interface AdminState {
  session: AdminSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AdminAction =
  | { type: 'LOGIN_SUCCESS'; payload: AdminSession }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

export interface ProductFormData {
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  category: ProductCategory;
  available: boolean;
  featured: boolean;
  customizationConfig: ProductCustomizationConfig;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface AppSettings {
  maintenanceMode: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  deliveryFee: number;
  deliveryEstimateText: string;
  /** Mock: senha alterada pelo admin (não usar em produção sem backend) */
  adminPasswordPlain?: string;
}

/** Conta de cliente — apenas armazenamento local no navegador (sem servidor/banco). */
export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** AVISO: mock local; em produção usar hash + backend. */
  password: string;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CustomerSession {
  user: CustomerUser;
  token: string;
  expiresAt: string;
}

export interface CustomerState {
  session: CustomerSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type CustomerAction =
  | { type: 'CUSTOMER_LOGIN_SUCCESS'; payload: CustomerSession }
  | { type: 'CUSTOMER_LOGOUT' }
  | { type: 'CUSTOMER_SET_LOADING'; payload: boolean };

export interface CustomerRegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
