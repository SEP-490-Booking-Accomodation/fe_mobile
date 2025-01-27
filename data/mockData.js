export const mockData = {
  destinations: [
    {
      id: '1',
      name: 'Beach Resort',
      location: 'Vũng Tàu',
      rating: 4.5,
      reviews: 3000,
      openHours: 'Mở cửa 10:00 - 23:00',
      description: 'A beautiful beach resort with stunning views and excellent amenities. Perfect for a weekend getaway or extended vacation. Enjoy the sea breeze and luxurious accommodations.',
      coordinate: {
        latitude: 10.4483,
        longitude: 107.1438
      },
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
      ]
    },
    {
      id: '2',
      name: 'Mountain Retreat',
      location: 'Đà Lạt',
      rating: 4.8,
      reviews: 2500,
      openHours: 'Mở cửa 08:00 - 22:00',
      description: 'A serene mountain retreat offering breathtaking views and peaceful surroundings. Perfect for those seeking relaxation and connection with nature.',
      coordinate: {
        latitude: 11.9404,
        longitude: 108.4583
      },
      amenities: ['WiFi', 'Hiking Trails', 'Restaurant', 'Garden', 'Fireplace'],
      rooms: [
        {
          id: '1',
          name: 'Mountain View Suite',
          location: 'Main Lodge',
          price: '800.000',
          priceUnit: 'h',
          rating: 4.7,
          reviewCount: 1500,
          imageUrl: require('../assets/images/mountain.jpg'),
          images: [
            { id: '1', source: require('../assets/images/beach.jpg') },
            { id: '2', source: require('../assets/images/beach.jpg') }
          ],
          amenities: ['WiFi', 'Balcony', 'Heating', 'Mountain View'],
          reviews: [{
            id: '1',
            userName: 'Emily Nguyen',
            rating: 5,
            comment: 'Tuyệt vời! Không gian yên bình và thoáng đãng.',
            images: [
              { id: '1', source: require('../assets/images/mountain.jpg') }
            ],
            date: '15/01/2025'
          }]
        }
      ]
    },
    {
      id: '3',
      name: 'City Center Hotel',
      location: 'Hồ Chí Minh',
      rating: 4.3,
      reviews: 4000,
      openHours: 'Mở cửa 00:00 - 23:59',
      description: 'A modern hotel located in the heart of the city, offering convenient access to shopping, dining, and cultural attractions.',
      coordinate: {
        latitude: 10.7769,
        longitude: 106.7009
      },
      amenities: ['WiFi', 'Fitness Center', 'Restaurant', 'Bar', 'Concierge'],
      rooms: [
        {
          id: '1',
          name: 'Deluxe City View',
          location: 'Main Building',
          price: '700.000',
          priceUnit: 'h',
          rating: 4.4,
          reviewCount: 2000,
          imageUrl: require('../assets/images/beach.jpg'),
          images: [
            { id: '1', source: require('../assets/images/beach.jpg') },
            { id: '2', source: require('../assets/images/beach.jpg') }
          ],
          amenities: ['WiFi', 'AC', 'City View', 'Work Desk'],
          reviews: [{
            id: '1',
            userName: 'Michael Tran',
            rating: 4,
            comment: 'Tiện nghi và vị trí rất tốt.',
            images: [
              { id: '1', source: require('../assets/images/beach.jpg') }
            ],
            date: '20/02/2025'
          }]
        }
      ]
    }
  ]
};

export const mockPolicies = [
  {
    id: "1",
    title: "Ưu đãi du lịch đặc biệt",
    description: "Thưởng thức ưu đãi đặc biệt cho những điểm đến mơ ước của bạn. Đây là cơ hội tuyệt vời để bạn trải nghiệm những hành trình tuyệt vời mà bạn luôn mơ ước. Đừng bỏ lỡ cơ hội này vì nó sẽ giúp bạn tiết kiệm rất nhiều chi phí và mang lại những kỷ niệm đáng nhớ trong chuyến đi của mình. Chúng tôi luôn nỗ lực mang đến cho bạn những ưu đãi tốt nhất để chuyến đi của bạn trở nên đặc biệt hơn bao giờ hết!",
    date: "12:00",
  },
  {
    id: "2",
    title: "Điểm đến mới đã có sẵn!",
    description: "Khám phá vẻ đẹp mới tại những điểm đến yêu thích của bạn. Cập nhật ứng dụng ngay để nhận ưu đãi độc quyền và không bỏ lỡ những địa điểm hấp dẫn mới nhất. Chúng tôi đã giới thiệu những điểm đến tuyệt vời mà bạn không thể bỏ qua trong năm nay. Hãy nhanh chóng đặt vé và trải nghiệm những cảnh đẹp tuyệt vời mà những địa điểm này mang lại cho bạn. Mỗi điểm đến đều hứa hẹn sẽ mang lại cho bạn những cảm giác mới lạ và những trải nghiệm khó quên.",
    date: "10:00",
  },
  {
    id: "3",
    title: "Chuẩn bị cho cuộc phiêu lưu của bạn!",
    description: "Đã đến lúc hoàn tất chuẩn bị cho chuyến đi của bạn. Bạn đã lên kế hoạch cho tất cả những gì cần mang theo chưa? Hãy kiểm tra danh sách của mình và đảm bảo rằng bạn đã chuẩn bị đủ mọi thứ để có một chuyến đi hoàn hảo. Cùng với đó, bạn cần kiểm tra những thông tin về điểm đến, các phương tiện di chuyển, và các hoạt động thú vị mà bạn có thể tham gia để chuyến đi thêm phần thú vị. Chúng tôi luôn sẵn sàng giúp bạn lên kế hoạch và hỗ trợ trong suốt hành trình của bạn.",
    date: "02/02/2023",
  },
  {
    id: "4",
    title: "Cảm ơn bạn vì trải nghiệm của mình!",
    description: "Các người dùng khác đã để lại những đánh giá tích cực về dịch vụ của chúng tôi. Chúng tôi rất vui khi bạn đã có một trải nghiệm tuyệt vời và hy vọng rằng bạn sẽ tiếp tục ủng hộ trong những lần sau. Chia sẻ trải nghiệm của bạn và nhận điểm thưởng để tiếp tục khám phá thêm nhiều ưu đãi hấp dẫn. Chúng tôi luôn đặt lợi ích của khách hàng lên hàng đầu và không ngừng cải thiện để mang lại những trải nghiệm tuyệt vời hơn nữa cho bạn trong tương lai.",
    date: "02/02/2023",
  },
  {
    id: "5",
    title: "Dự báo thời tiết cho điểm đến của bạn",
    description: "Đừng quên kiểm tra dự báo thời tiết để chuẩn bị cho chuyến đi của mình một cách chu đáo nhất. Thời tiết có thể thay đổi bất ngờ, vì vậy hãy luôn chắc chắn rằng bạn đã chuẩn bị đầy đủ trang phục phù hợp. Chúng tôi cung cấp thông tin chi tiết về nhiệt độ, độ ẩm và các yếu tố thời tiết khác để bạn có thể lên kế hoạch cho chuyến đi một cách thuận lợi và thoải mái nhất. Chúc bạn khám phá vui vẻ và có những khoảnh khắc tuyệt vời tại điểm đến của mình!",
    date: "10/01/2023",
  },
];
