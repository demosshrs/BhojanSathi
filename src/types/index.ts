export interface MenuItem {
  name: string;
  description: string;
  price: number;
  tags: string[];
  chefsPick: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  tags: string[];
  rating: number;
  price: string;
  distance: string;
  address: string;
  hours: string;
  image: string;
  description: string;
  openNow: boolean;
  phone: string;
  menu: MenuCategory[];
}

export interface Reservation {
  id?: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: string;
  status: 'pending' | 'confirmed' | 'declined';
  requests: string;
  createdAt: number;
}

export interface User {
  name: string;
  phone: string;
  email: string;
  role: 'user' | 'owner';
}

export interface MoodOption {
  label: string;
  emoji: string;
}
