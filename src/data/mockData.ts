import { Restaurant, MoodOption } from '../types';

const m = (name: string, d: string, price: number, tags: string[], chefsPick = false) =>
  ({ name, description: d, price, tags, chefsPick });

export const mockRestaurants: Restaurant[] = [
  {
    id: '1', name: 'Bhojan Griha', cuisine: 'Newari', tags: ['Traditional', 'Fine Dining'],
    rating: 4.7, price: 'Rs.Rs.Rs.', distance: '0.8 km', address: 'Dillibazar, Kathmandu',
    hours: '11:00 AM – 10:00 PM', openNow: true, phone: '+977-1-4411170',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    description: 'Heritage Rana-era building serving authentic Newari cuisine with cultural shows.',
    menu: [
      { name: 'Starters', items: [m('Chatamari', 'Newari rice crepe', 350, ['VEG']), m('Choila', 'Spiced grilled buffalo', 400, ['SPICY'], true), m('Newari Khaja Set', 'Traditional snack platter', 650, ['SPICY'])] },
      { name: 'Mains', items: [m('Yomari', 'Steamed rice flour dumplings', 300, ['VEG'], true), m('Kwati', 'Mixed bean soup', 280, ['VEG'])] },
    ],
  },
  {
    id: '2', name: 'Thakali Kitchen', cuisine: 'Thakali', tags: ['Traditional', 'Set Meals'],
    rating: 4.6, price: 'Rs.Rs.', distance: '1.2 km', address: 'Jyatha, Thamel, Kathmandu',
    hours: '10:00 AM – 9:00 PM', openNow: true, phone: '+977-1-4700890',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400',
    description: 'Authentic Thakali dal bhat with ghee and unlimited refills.',
    menu: [
      { name: 'Set Meals', items: [m('Thakali Dal Bhat', 'Dal, rice, veg, pickle', 350, ['VEG'], true), m('Mutton Dal Bhat', 'With tender mutton curry', 480, ['SPICY'])] },
      { name: 'Sides', items: [m('Alu Tama', 'Bamboo shoot potato curry', 180, ['VEG', 'SPICY']), m('Gundruk', 'Fermented leafy greens', 150, ['VEG'])] },
    ],
  },
  {
    id: '3', name: 'Fire & Ice', cuisine: 'Italian', tags: ['Pizza', 'Pasta'],
    rating: 4.4, price: 'Rs.Rs.Rs.', distance: '0.5 km', address: 'Tridevi Marg, Thamel',
    hours: '11:00 AM – 11:00 PM', openNow: true, phone: '+977-1-4250210',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    description: "Kathmandu's original pizzeria, famous for wood-fired pizzas.",
    menu: [
      { name: 'Pizzas', items: [m('Margherita', 'Tomato, mozzarella, basil', 750, ['VEG']), m('Diavola', 'Spicy salami and chili', 900, ['SPICY'], true), m('Himalayan Special', 'Chicken tikka, onion, peppers', 950, ['SPICY'])] },
      { name: 'Pasta', items: [m('Penne Arrabbiata', 'Spicy tomato sauce', 650, ['VEG', 'SPICY']), m('Spaghetti Bolognese', 'Classic meat sauce', 700, [])] },
    ],
  },
  {
    id: '4', name: 'Yangling Tibetan', cuisine: 'Tibetan', tags: ['Momos', 'Noodles'],
    rating: 4.8, price: 'Rs.', distance: '0.3 km', address: 'Boudha, Kathmandu',
    hours: '8:00 AM – 8:00 PM', openNow: true, phone: '+977-1-4470080',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
    description: 'Authentic Tibetan flavors with the best momos in Boudha.',
    menu: [
      { name: 'Momos', items: [m('Steam Veg Momo', '10 pieces veg filling', 180, ['VEG']), m('C-Momo (Buff)', 'Chilli momos, crispy', 220, ['SPICY'], true), m('Jhol Momo', 'Momos in spiced broth', 200, ['SPICY'])] },
      { name: 'Noodles', items: [m('Thukpa', 'Tibetan noodle soup', 200, []), m('Thenthuk', 'Hand-pulled flat noodles', 220, [])] },
    ],
  },
  {
    id: '5', name: 'Krishnarpan', cuisine: 'Nepali', tags: ['Fine Dining', 'Cultural'],
    rating: 4.9, price: 'Rs.Rs.Rs.Rs.', distance: '2.1 km', address: "Dwarika's Hotel, Battisputali",
    hours: '7:00 PM – 10:00 PM', openNow: false, phone: '+977-1-4479488',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    description: 'Multi-course Nepali tasting menu in a heritage hotel setting.',
    menu: [
      { name: 'Tasting Menu', items: [m('6-Course Set', 'Traditional Nepali multi-course', 3500, ['VEG'], true), m('12-Course Set', 'Full regional tasting experience', 6000, [])] },
      { name: 'À La Carte', items: [m('Sekuwa Platter', 'Grilled meats with chutneys', 1800, ['SPICY']), m('Alu Ko Achar', 'Spiced potato salad', 400, ['VEG', 'SPICY'])] },
    ],
  },
];

export const moods: MoodOption[] = [
  { label: 'Date night', emoji: '🕯️' },
  { label: 'Quick bite', emoji: '⚡' },
  { label: 'Family', emoji: '👨‍👩‍👧' },
  { label: 'Something new', emoji: '✨' },
  { label: 'Comfort food', emoji: '🍲' },
];

export const cuisines = [
  { label: 'Newari', emoji: '🍛' }, { label: 'Thakali', emoji: '🥘' },
  { label: 'Momo', emoji: '🥟' }, { label: 'Indian', emoji: '🫓' },
  { label: 'Chinese', emoji: '🍜' }, { label: 'Italian', emoji: '🍕' },
  { label: 'Korean', emoji: '🍱' }, { label: 'Japanese', emoji: '🍣' },
];
