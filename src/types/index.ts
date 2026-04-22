// ─── Auth & User ─────────────────────────────────────────

export type UserRole = 'user' | 'owner';

export interface AppUser {
  id: string;
  name: string;
  phone?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tasteProfile?: TasteProfile;
  createdAt: string;
}

export interface TasteProfile {
  cuisines: string[];
  dietary: DietaryTag[];
  budget: 'low' | 'medium' | 'high';
  moods: string[];
}

// ─── Restaurant ───────────────────────────────────────────

export type PriceLevel = 'Rs' | 'RsRs' | 'RsRsRs';
export type DietaryTag = 'VEG' | 'VEGAN' | 'HALAL' | 'GLUTEN_FREE';
export type MenuTag = 'VEG' | 'SPICY' | 'CHEFS_PICK';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  price: PriceLevel;
  distance: string;
  isOpen: boolean;
  description: string;
  address: string;
  phone: string;
  images: string[];
  location: GeoPoint;
  acceptsReservations: boolean;
  whatsapp?: string;
}

// ─── Menu ─────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  tags: MenuTag[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// ─── Reservation ──────────────────────────────────────────

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  requests?: string;
  createdAt: string;
}

// ─── Mood / UI ────────────────────────────────────────────

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface CuisineItem {
  label: string;
  emoji: string;
}

// ─── Navigation ───────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  RestaurantDetail: { restaurantId: string };
  Reserve: { restaurantId: string; restaurantName: string };
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  AIChat: undefined;
  Saved: undefined;
  Profile: undefined;
};

// ─── Owner ────────────────────────────────────────────────

export interface OwnerStats {
  views: number;
  reservations: number;
  pending: number;
  menuItems: number;
}

export interface BookingPreview {
  id: string;
  guestName: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
}

// ─── AI Chat ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  restaurants?: Restaurant[];
  timestamp: Date;
}
