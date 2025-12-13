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
    {
        id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        category: 'dining',
        name: 'La Pasta House',
        type: 'Italian • $$',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80',
        description: 'Authentic Italian cuisine in a cozy atmosphere. Famous for our homemade pasta and wood-fired pizzas.',
        address: '123 Olive Garden Way, Foodville',
        phone: '(555) 123-4567',
        about: 'La Pasta House has been serving the community for over 20 years. Our chefs use only the freshest ingredients imported directly from Italy.',
        coordinates: { lat: 37.7749, lng: -122.4194 },
        services: [
            { name: 'Dinner Reservation', duration: 90, price: 0 },
            { name: 'Private Event', duration: 180, price: 500 }
        ]
    },
    {
        id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
        category: 'dining',
        name: 'Sushi Zen',
        type: 'Japanese • $$$',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
        description: 'Premium sushi and sashimi prepared by master chefs using daily flown-in fish.',
        address: '456 Bamboo Lane, Japantown',
        phone: '(555) 987-6543',
        about: 'Experience the art of sushi at Sushi Zen. We offer an omakase experience that changes daily based on market availability.',
        coordinates: { lat: 37.7849, lng: -122.4294 }
    },
    // Healthcare
    {
        id: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
        category: 'healthcare',
        name: 'City Dental',
        type: 'Dentist',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf4722e02?w=500&q=80',
        description: 'Comprehensive dental care for the whole family. From checkups to cosmetic surgery.',
        address: '789 Smile Blvd, Health City',
        phone: '(555) 222-3333',
        about: 'At City Dental, we prioritize your comfort and dental health. utilizing state-of-the-art technology for pain-free treatments.',
        coordinates: { lat: 37.7949, lng: -122.4394 },
        services: [
            { name: 'Checkup & Cleaning', duration: 60, price: 120 },
            { name: 'Teeth Whitening', duration: 90, price: 300 },
            { name: 'Filling', duration: 45, price: 180 }
        ]
    },
    {
        id: 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
        category: 'healthcare',
        name: 'Dr. Sarah Smith',
        type: 'General Practitioner',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&q=80',
        description: 'Experienced family doctor providing compassionate primary care.',
        address: '101 Healing Way, Wellness Park',
        phone: '(555) 444-5555',
        about: 'Dr. Smith has over 15 years of experience in internal medicine. She believes in a holistic approach to patient health.',
        coordinates: { lat: 37.8049, lng: -122.4494 },
        services: [
            { name: 'General Consultation', duration: 30, price: 100 },
            { name: 'Physical Exam', duration: 60, price: 200 }
        ]
    },
    {
        id: 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
        category: 'healthcare',
        name: 'Dr. James Wilson',
        type: 'Cardiologist',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80',
        description: 'Expert cardiac care tailored to your specific needs.',
        address: '202 Heartbeat Ave, Medical District',
        phone: '(555) 666-7777',
        about: 'Specializing in preventive cardiology and heart failure management. Dr. Wilson is renowned for his patient-centered approach.',
        coordinates: { lat: 37.8149, lng: -122.4594 }
    },
    {
        id: 'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c',
        category: 'healthcare',
        name: 'Dr. Emily Chen',
        type: 'Pediatrician',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1594824476969-23c961d32638?w=500&q=80',
        description: 'Friendly and nurturing care for infants, children, and adolescents.',
        address: '303 Kids Court, Suburbia',
        phone: '(555) 888-9999',
        about: 'Dr. Chen loves working with kids and making sure they grow up healthy and strong. Her clinic is designed to be child-friendly.',
        coordinates: { lat: 37.8249, lng: -122.4694 }
    },
    // Beauty
    {
        id: 'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
        category: 'beauty',
        name: 'Glow Spa',
        type: 'Massage & Facial',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80',
        description: 'Relax and rejuvenate with our premium spa services.',
        address: '555 Serenity Lane, Relaxville',
        phone: '(555) 111-2222',
        about: 'Glow Spa offers a sanctuary from the hustle and bustle of city life. Enjoy our signature massages and organic facials.',
        coordinates: { lat: 37.8349, lng: -122.4794 },
        services: [
            { name: 'Swedish Massage', duration: 60, price: 120 },
            { name: 'Deep Tissue Massage', duration: 90, price: 150 },
            { name: 'Facial Treatment', duration: 75, price: 130 }
        ]
    },
    {
        id: 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
        category: 'beauty',
        name: 'Luxe Nails',
        type: 'Nail Salon',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80',
        description: 'Professional nail care and art in a modern salon.',
        address: '777 Polish Place, Glamour City',
        phone: '(555) 333-4444',
        about: 'Our talented technicians can create any design you desire. We use high-quality, long-lasting polishes.',
        coordinates: { lat: 37.8449, lng: -122.4894 }
    },
    // Fitness
    {
        id: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
        category: 'fitness',
        name: 'Iron Gym',
        type: '24/7 Gym',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
        description: 'Fully equipped gym open 24 hours a day for all your fitness needs.',
        address: '888 Muscle St, Strength Town',
        phone: '(555) 555-6666',
        about: 'Whether you want to lift heavy or do cardio, Iron Gym has the equipment for you. Personal training available.',
        coordinates: { lat: 37.8549, lng: -122.4994 }
    },
    {
        id: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
        category: 'fitness',
        name: 'Yoga Flow',
        type: 'Yoga Studio',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1599447421405-0e5a10c0071d?w=500&q=80',
        description: 'Find your inner peace with our variety of yoga classes.',
        address: '999 Zen Way, Peace Valley',
        phone: '(555) 777-8888',
        about: 'From Vinyasa to Yin, we have classes for all levels. Join our community and discover the benefits of yoga.',
        coordinates: { lat: 37.8649, lng: -122.5094 }
    },
    // Auto
    {
        id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
        category: 'auto',
        name: 'Speedy Fix',
        type: 'Auto Repair',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1632823471443-bf6b801a238c?w=500&q=80',
        description: 'Fast and reliable auto repair services.',
        address: '123 Motor Mile, Car City',
        phone: '(555) 999-0000',
        about: 'Our mechanics are ASE certified and ready to fix any issue with your vehicle. We offer fair prices and quick turnaround.',
        coordinates: { lat: 37.8749, lng: -122.5194 }
    },
    {
        id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
        category: 'auto',
        name: 'Pro Detailers',
        type: 'Car Wash',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&q=80',
        description: 'Executive car detailing service.',
        address: '456 Shine St, Sparkle Town',
        phone: '(555) 121-2121',
        about: 'We make your car look brand new inside and out. We use eco-friendly products and gentle techniques.',
        coordinates: { lat: 37.8849, lng: -122.5294 }
    },
    // Pets
    {
        id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
        category: 'pets',
        name: 'Happy Paws',
        type: 'Veterinary Clinic',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1628009368231-7603352984cc?w=500&q=80',
        description: 'Compassionate veterinary care for your furry friends.',
        address: '789 Bark Blvd, Pet Paradise',
        phone: '(555) 343-4343',
        about: 'Our team loves animals and treats every patient like their own pet. We offer wellness exams, surgery, and emergency care.',
        coordinates: { lat: 37.8949, lng: -122.5394 }
    },
    {
        id: 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e',
        category: 'pets',
        name: 'Pet Resort',
        type: 'Boarding',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&q=80',
        description: 'Luxury boarding and daycare for dogs and cats.',
        address: '101 Play Place, Animal Kingdom',
        phone: '(555) 565-6565',
        about: 'Going on vacation? Leave your pet with us! They will have a blast playing with friends and getting plenty of love.',
        coordinates: { lat: 37.9049, lng: -122.5494 }
    },
];
