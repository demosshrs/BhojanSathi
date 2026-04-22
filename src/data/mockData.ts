import type { Restaurant, MenuCategory, Mood, CuisineItem, BookingPreview, OwnerStats } from '../types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Bhojan Griha',
    cuisine: 'Newari · Traditional · Fine Dining',
    tags: ['Newari', 'Traditional', 'Fine Dining'],
    rating: 4.7,
    ratingCount: 128,
    price: 'RsRsRs',
    distance: '0.8 km',
    isOpen: true,
    description: 'Heritage Rana-era building serving authentic Newari cuisine with cultural shows.',
    address: 'Dilli Bazaar, Kathmandu',
    phone: '+977 1 4221711',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    ],
    location: { lat: 27.7041, lng: 85.3145 },
    acceptsReservations: true,
    whatsapp: '+9779841000001',
  },
  {
    id: '2',
    name: 'Thakali Kitchen',
    cuisine: 'Thakali · Daal Bhat',
    tags: ['Thakali', 'Nepali'],
    rating: 4.6,
    ratingCount: 94,
    price: 'Rs',
    distance: '0.5 km',
    isOpen: true,
    description: 'Authentic Thakali thali with unlimited refills. Best daal bhat in Thamel.',
    address: 'Thamel, Kathmandu',
    phone: '+977 1 4700444',
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
    location: { lat: 27.7152, lng: 85.3123 },
    acceptsReservations: true,
  },
  {
    id: '3',
    name: 'Fire & Ice',
    cuisine: 'Italian · Pizza',
    tags: ['Italian', 'Pizza', 'Western'],
    rating: 4.4,
    ratingCount: 215,
    price: 'RsRs',
    distance: '1.1 km',
    isOpen: true,
    description: "Kathmandu's favourite Italian restaurant since 1995. Wood-fired pizzas.",
    address: 'Tridevi Marg, Kathmandu',
    phone: '+977 1 4250210',
    images: ['https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800'],
    location: { lat: 27.7133, lng: 85.3149 },
    acceptsReservations: false,
  },
  {
    id: '4',
    name: 'Yangling Tibetan',
    cuisine: 'Tibetan · Momos',
    tags: ['Tibetan', 'Momos', 'Quick bite'],
    rating: 4.8,
    ratingCount: 312,
    price: 'Rs',
    distance: '0.3 km',
    isOpen: true,
    description: 'Legendary jhol momo spot. Family-run for 20+ years.',
    address: 'Jyatha, Thamel',
    phone: '+977 1 4412345',
    images: ['https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800'],
    location: { lat: 27.7161, lng: 85.3118 },
    acceptsReservations: false,
  },
  {
    id: '5',
    name: 'Krishnarpan',
    cuisine: 'Nepali · Fine Dining',
    tags: ['Nepali', 'Fine Dining', 'Royal'],
    rating: 4.9,
    ratingCount: 86,
    price: 'RsRsRs',
    distance: '2.3 km',
    isOpen: false,
    description: 'Multi-course royal Nepali dining experience at Dwarika\'s Hotel.',
    address: "Dwarika's Hotel, Battisputali",
    phone: '+977 1 4479488',
    images: ['https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800'],
    location: { lat: 27.7026, lng: 85.3310 },
    acceptsReservations: true,
  },
];

export const MOCK_MENU: MenuCategory[] = [
  {
    id: 'starters',
    name: 'STARTERS',
    items: [
      { id: 's1', name: 'Chatamari', description: 'Newari rice crepe with egg and minced meat', price: 350, tags: ['VEG'] },
      { id: 's2', name: 'Choila', description: 'Spiced charcoal-grilled buffalo', price: 400, tags: ['SPICY'] },
      { id: 's3', name: 'Newari Khaja Set', description: 'Traditional beaten rice platter', price: 650, tags: ['SPICY'] },
    ],
  },
  {
    id: 'mains',
    name: 'MAIN COURSE',
    items: [
      { id: 'm1', name: 'Thakali Thali', description: 'Complete meal with daal, bhat, tarkari, achaar', price: 850, tags: ['CHEFS_PICK'] },
      { id: 'm2', name: 'Mutton Sekuwa', description: 'Marinated grilled mutton skewers', price: 750, tags: ['SPICY'] },
      { id: 'm3', name: 'Aloo Tama Bodi', description: 'Potato, bamboo shoot and black-eyed beans curry', price: 450, tags: ['VEG', 'CHEFS_PICK'] },
    ],
  },
  {
    id: 'drinks',
    name: 'DRINKS',
    items: [
      { id: 'd1', name: 'Chyang (Traditional Beer)', description: 'House-fermented millet beer', price: 250, tags: [] },
      { id: 'd2', name: 'Lassi', description: 'Sweet yogurt drink', price: 180, tags: ['VEG'] },
      { id: 'd3', name: 'Masala Tea', description: 'Spiced milk tea', price: 120, tags: ['VEG'] },
    ],
  },
];

export const MOCK_MOODS: Mood[] = [
  { id: 'date', label: 'Date night', emoji: '🕯️', color: '#ED93B1' },
  { id: 'quick', label: 'Quick bite', emoji: '⚡', color: '#FAC775' },
  { id: 'family', label: 'Family feast', emoji: '👨‍👩‍👧', color: '#5DCAA5' },
  { id: 'new', label: 'Something new', emoji: '✨', color: '#AFA9EC' },
  { id: 'comfort', label: 'Comfort food', emoji: '🍲', color: '#F0997B' },
];

export const MOCK_CUISINES: CuisineItem[] = [
  { label: 'Newari', emoji: '🍛' },
  { label: 'Thakali', emoji: '🥘' },
  { label: 'Momo', emoji: '🥟' },
  { label: 'Indian', emoji: '🍲' },
  { label: 'Chinese', emoji: '🥡' },
  { label: 'Italian', emoji: '🍕' },
  { label: 'Korean', emoji: '🍜' },
  { label: 'Japanese', emoji: '🍣' },
];

export const MOCK_OWNER_STATS: OwnerStats = {
  views: 1247,
  reservations: 38,
  pending: 5,
  menuItems: 24,
};

export const MOCK_BOOKINGS: BookingPreview[] = [
  { id: 'b1', guestName: 'Rahul S.', date: 'Mar 22', time: '7:00 PM', partySize: 2, status: 'pending' },
  { id: 'b2', guestName: 'Anita K.', date: 'Mar 22', time: '7:00 PM', partySize: 2, status: 'confirmed' },
  { id: 'b3', guestName: 'Sagar M.', date: 'Mar 23', time: '1:00 PM', partySize: 4, status: 'confirmed' },
];
