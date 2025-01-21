export const mockData = {
  destinations: [{
      id: '1',
      name: 'Beach Resort',
      location: 'Vũng Tàu',
      rating: 4.5,
      reviews: 3000,
      openHours: 'Mở cửa 10:00 - 23:00',
      description: 'A beautiful beach resort with stunning views and excellent amenities. Perfect for a weekend getaway or extended vacation. Enjoy the sea breeze and luxurious accommodations.',
      amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant', 'Spa'],
      rooms: [
          {
              id: '1',
              name: 'Deluxe Ocean View',
              location: 'Wing A',
              price: '500.000',
              priceUnit: 'h',
              rating: 4.5,
              reviewCount: 3000,
              imageUrl: require('../assets/images/beach.jpg'),
              images: [
                  { id: '1', source: require('../assets/images/beach.jpg') },
                  { id: '2', source: require('../assets/images/beach.jpg') },
                  { id: '3', source: require('../assets/images/beach.jpg') }
              ],
              amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Ocean View'],
              reviews: [{
                  id: '1',
                  userName: 'Zane Pham',
                  rating: 5,
                  comment: 'Gất tuyệt 🥰💯',
                  images: [
                      { id: '1', source: require('../assets/images/beach.jpg') },
                      { id: '2', source: require('../assets/images/beach.jpg') }
                  ],
                  date: '30/12/2024'
              }]
          }
          // Add more rooms as needed
      ]
  }]
};