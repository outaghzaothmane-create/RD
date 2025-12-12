import { Car, Dumbbell, PawPrint, Sparkles, Stethoscope, Utensils } from 'lucide-react-native';

export const CATEGORIES = [
    {
        id: 'dining',
        name: 'Dining',
        icon: Utensils,
        iconColor: '#f97316', // Orange-500
        size: 'large',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
    },
    {
        id: 'healthcare',
        name: 'Healthcare',
        icon: Stethoscope,
        iconColor: '#10b981', // Emerald-500
        size: 'small',
    },
    {
        id: 'beauty',
        name: 'Beauty & Spa',
        icon: Sparkles,
        iconColor: '#a855f7', // Purple-500
        size: 'small',
    },
    {
        id: 'fitness',
        name: 'Fitness',
        icon: Dumbbell,
        iconColor: '#3b82f6', // Blue-500
        size: 'small',
    },
    {
        id: 'auto',
        name: 'Automotive',
        icon: Car,
        iconColor: '#64748b', // Slate-500
        size: 'small',
    },
    {
        id: 'pets',
        name: 'Pet Services',
        icon: PawPrint,
        iconColor: '#eab308', // Yellow-500
        size: 'small',
    },
];

export const BUSINESSES = [
    // Dining
    { id: '1', category: 'dining', name: 'La Pasta House', type: 'Italian • $$', rating: 4.8, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80' },
    { id: '2', category: 'dining', name: 'Sushi Zen', type: 'Japanese • $$$', rating: 4.9, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
    // Healthcare
    { id: '3', category: 'healthcare', name: 'City Dental', type: 'Dentist', rating: 4.9, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf4722e02?w=500&q=80' },
    { id: '4', category: 'healthcare', name: 'Dr. Smith & Associates', type: 'General Practitioner', rating: 4.7, image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&q=80' },
    // Beauty
    { id: '5', category: 'beauty', name: 'Glow Spa', type: 'Massage & Facial', rating: 4.8, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80' },
    { id: '6', category: 'beauty', name: 'Luxe Nails', type: 'Nail Salon', rating: 4.6, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80' },
    // Fitness
    { id: '7', category: 'fitness', name: 'Iron Gym', type: '24/7 Gym', rating: 4.5, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
    { id: '8', category: 'fitness', name: 'Yoga Flow', type: 'Yoga Studio', rating: 4.9, image: 'https://images.unsplash.com/photo-1599447421405-0e5a10c0071d?w=500&q=80' },
    // Auto
    { id: '9', category: 'auto', name: 'Speedy Fix', type: 'Auto Repair', rating: 4.7, image: 'https://images.unsplash.com/photo-1632823471443-bf6b801a238c?w=500&q=80' },
    { id: '10', category: 'auto', name: 'Pro Detailers', type: 'Car Wash', rating: 4.8, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&q=80' },
    // Pets
    { id: '11', category: 'pets', name: 'Happy Paws', type: 'Veterinary Clinic', rating: 4.9, image: 'https://images.unsplash.com/photo-1628009368231-7603352984cc?w=500&q=80' },
    { id: '12', category: 'pets', name: 'Pet Resort', type: 'Boarding', rating: 4.7, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&q=80' },
];
