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
    "_id": "67bc2ed8aee2b2d8120163c2",
    "staffId": null,
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "test",
    "description": "dfsdf",
    "value": "12",
    "unit": "percent",
    "startDate": "20/02/2027 08:33:00",
    "endDate": "20/02/2028 08:33:00",
    "isActive": false,
    "isDelete": false,
    "createdAt": "24/02/2025 15:33:28",
    "updatedAt": "27/02/2025 11:16:10",
    "__v": 0,
    "updateBy": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "id": "67bc2ed8aee2b2d8120163c2"
  },
  {
    "_id": "67bc76c3aee2b2d812016431",
    "staffId": null,
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "test",
    "description": "sdfsdfdsf",
    "value": "12",
    "unit": "percent",
    "startDate": "20/02/2026 16:39:00",
    "endDate": "20/02/2028 13:39:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "24/02/2025 20:40:19",
    "updatedAt": "24/02/2025 20:40:19",
    "__v": 0,
    "id": "67bc76c3aee2b2d812016431"
  },
  {
    "_id": "67beb3403b186598b2a38745",
    "staffId": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "test",
    "description": "seref",
    "value": "12",
    "unit": "percent",
    "startDate": "20/02/2027 06:22:00",
    "endDate": "20/02/2028 06:22:00",
    "isActive": false,
    "isDelete": false,
    "createdAt": "26/02/2025 13:22:56",
    "updatedAt": "26/02/2025 13:23:05",
    "__v": 0,
    "updateBy": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "id": "67beb3403b186598b2a38745"
  },
  {
    "_id": "67bf432c11f764ca9b652117",
    "staffId": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "321",
    "description": "123",
    "value": "20",
    "unit": "percent",
    "startDate": "20/02/2027 16:39:00",
    "endDate": "20/02/2028 16:35:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "26/02/2025 23:37:00",
    "updatedAt": "26/02/2025 23:37:00",
    "__v": 0,
    "id": "67bf432c11f764ca9b652117"
  },
  {
    "_id": "67bf457c11f764ca9b65219b",
    "staffId": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "333",
    "description": "333",
    "value": "333",
    "unit": "vnd",
    "startDate": "20/04/2028 16:43:00",
    "endDate": "20/04/2030 16:43:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "26/02/2025 23:46:52",
    "updatedAt": "26/02/2025 23:46:52",
    "__v": 0,
    "id": "67bf457c11f764ca9b65219b"
  },
  {
    "_id": "67bf45ba11f764ca9b6521a8",
    "staffId": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "444",
    "description": "444",
    "value": "444",
    "unit": "percent",
    "startDate": "20/03/2027 16:47:00",
    "endDate": "20/03/2031 16:47:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "26/02/2025 23:47:54",
    "updatedAt": "26/02/2025 23:47:54",
    "__v": 0,
    "id": "67bf45ba11f764ca9b6521a8"
  },
  {
    "_id": "67bf467eb702f8e5f86015d7",
    "staffId": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "123",
    "description": "123321",
    "value": "123321",
    "unit": "percent",
    "startDate": "28/03/2025 23:50:00",
    "endDate": "31/03/2025 23:50:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "26/02/2025 23:51:10",
    "updatedAt": "26/02/2025 23:51:10",
    "__v": 0,
    "id": "67bf467eb702f8e5f86015d7"
  },
  {
    "_id": "67bfe56786bb5d7f651f2536",
    "staffId": {
      "_id": "67b7b63be768c5abd6cf5e67",
      "userId": {
        "_id": "67b7b63ae768c5abd6cf5e65",
        "fullName": "Nguyễn Hoàng Nguyên",
        "email": "vopvipbmt@gmail.com",
        "phone": "0948813064",
        "doB": "12/02/2001",
        "avatarUrl": [
          ""
        ],
        "isVerifiedEmail": false,
        "__v": 0,
        "id": "67b7b63ae768c5abd6cf5e65",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67b7b63be768c5abd6cf5e67",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": null,
    "name": "",
    "startDate": "05/04/2025 15:30:45",
    "endDate": "06/04/2025 15:30:45",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 11:09:11",
    "updatedAt": "27/02/2025 11:23:23",
    "__v": 0,
    "id": "67bfe56786bb5d7f651f2536"
  },
  {
    "_id": "67bfea3a79965a88faff5108",
    "staffId": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "test",
    "description": "xcvxcv",
    "value": "213",
    "unit": "percent",
    "startDate": "20/02/2027 10:28:00",
    "endDate": "20/02/2028 15:28:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 11:29:46",
    "updatedAt": "27/02/2025 11:29:46",
    "__v": 0,
    "id": "67bfea3a79965a88faff5108"
  },
  {
    "_id": "67bfeb5379965a88faff5115",
    "staffId": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "ưqewq",
    "description": "ưqewq",
    "value": "213",
    "unit": "percent",
    "startDate": "20/02/2027 10:31:00",
    "endDate": "20/02/2028 04:31:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 11:34:27",
    "updatedAt": "27/02/2025 11:34:27",
    "__v": 0,
    "id": "67bfeb5379965a88faff5115"
  },
  {
    "_id": "67bfec2579965a88faff512b",
    "staffId": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "stringasdfsdf",
    "description": "fsdfsdf",
    "value": "231",
    "unit": "percent",
    "startDate": "27/02/2025 15:30:45",
    "endDate": "28/02/2025 15:30:45",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 11:37:57",
    "updatedAt": "27/02/2025 11:37:57",
    "__v": 0,
    "id": "67bfec2579965a88faff512b"
  },
  {
    "_id": "67c08ff5ddf6317f33de5511",
    "staffId": {
      "_id": "67b7b63be768c5abd6cf5e67",
      "userId": {
        "_id": "67b7b63ae768c5abd6cf5e65",
        "fullName": "Nguyễn Hoàng Nguyên",
        "email": "vopvipbmt@gmail.com",
        "phone": "0948813064",
        "doB": "12/02/2001",
        "avatarUrl": [
          ""
        ],
        "isVerifiedEmail": false,
        "__v": 0,
        "id": "67b7b63ae768c5abd6cf5e65",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67b7b63be768c5abd6cf5e67",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67ab1a289c55b43935bfeadd",
      "categoryKey": "2",
      "categoryName": "test",
      "categoryDescription": "test",
      "__v": 0,
      "id": "67ab1a289c55b43935bfeadd",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": null,
    "name": "test",
    "startDate": "03/01/2025 15:30:45",
    "endDate": "03/02/2025 15:30:45",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 23:16:53",
    "updatedAt": "27/02/2025 23:16:53",
    "__v": 0,
    "id": "67c08ff5ddf6317f33de5511"
  },
  {
    "_id": "67c090d3a781cd67e9480c31",
    "staffId": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "string231",
    "description": "string",
    "value": "string",
    "unit": "string",
    "startDate": "03/04/2025 15:30:45",
    "endDate": "03/05/2025 15:30:45",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 23:20:35",
    "updatedAt": "27/02/2025 23:20:35",
    "__v": 0,
    "id": "67c090d3a781cd67e9480c31"
  },
  {
    "_id": "67c091b272cd0cf1dd71c6d9",
    "staffId": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "string231",
    "description": "string",
    "value": "string",
    "unit": "string",
    "startDate": "04/03/2025 15:30:45",
    "endDate": "05/03/2025 15:30:45",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 23:24:18",
    "updatedAt": "27/02/2025 23:24:18",
    "__v": 0,
    "id": "67c091b272cd0cf1dd71c6d9"
  },
  {
    "_id": "67c09223e7e373677f89edf6",
    "staffId": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "123456",
    "description": "0987654321",
    "value": "123",
    "unit": "vnd",
    "startDate": "20/03/2001 16:24:00",
    "endDate": "20/04/2028 16:24:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 23:26:11",
    "updatedAt": "27/02/2025 23:26:11",
    "__v": 0,
    "id": "67c09223e7e373677f89edf6"
  },
  {
    "_id": "67c0986894a36689d09875c0",
    "staffId": {
      "_id": "67ab6d7edae78ccabdcdb9bf",
      "userId": null,
      "__v": 0,
      "id": "67ab6d7edae78ccabdcdb9bf",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "updateBy": {
      "_id": "67ab6f7e05feae0cfd22208f",
      "userId": {
        "_id": "67ab6f7e05feae0cfd22208d",
        "fullName": "staff",
        "email": "staff@gmail.com",
        "phone": "0987654321",
        "doB": "12/02/2001",
        "avatarUrl": [
          "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
          "https://m.media-amazon.com/images/M/MV5BNTRjMDA5ZTQtNWVkMy00OTAwLWI2NmMtYjQxYWM4MTIxYWFhXkEyXkFqcGc@._V1_.jpg"
        ],
        "isVerifiedEmail": true,
        "__v": 0,
        "passwordResetExpires": "2025-02-15T06:03:33.916Z",
        "passwordResetToken": "31e08542efb56ca2f25b7d481dfe767f256312f0e56abdf108a153c0daa654a7",
        "emailVerificationExpires": "2025-02-19T08:37:29.823Z",
        "emailVerificationOTP": "39695d387f4dedce5ab9a9b5ea01d1887b9e486b66b9836ef25cf6889b5882b3",
        "id": "67ab6f7e05feae0cfd22208d",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab6f7e05feae0cfd22208f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67ab1a289c55b43935bfeadd",
      "categoryKey": "2",
      "categoryName": "test",
      "categoryDescription": "test",
      "__v": 0,
      "id": "67ab1a289c55b43935bfeadd",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67aad0259c55b43935bfea66",
      "value": "21",
      "unit": "Percent",
      "__v": 0,
      "id": "67aad0259c55b43935bfea66",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "testtttt",
    "description": "string",
    "value": "1",
    "unit": "1",
    "startDate": "01/03/2025 15:30:45",
    "endDate": "04/03/2025 15:30:45",
    "isActive": true,
    "isDelete": false,
    "createdAt": "27/02/2025 23:52:56",
    "updatedAt": "27/02/2025 23:52:56",
    "__v": 0,
    "id": "67c0986894a36689d09875c0"
  },
  {
    "_id": "67c1c744f27a690ea9c6625e",
    "staffId": {
      "_id": "67ab6d7edae78ccabdcdb9bf",
      "userId": null,
      "__v": 0,
      "id": "67ab6d7edae78ccabdcdb9bf",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": null,
    "name": "df",
    "description": "sdf",
    "value": "string",
    "unit": "string",
    "startDate": "01/03/2025 15:30:45",
    "endDate": "02/03/2025 15:30:45",
    "isActive": true,
    "isDelete": false,
    "createdAt": "28/02/2025 21:25:08",
    "updatedAt": "28/02/2025 21:25:08",
    "__v": 0,
    "id": "67c1c744f27a690ea9c6625e"
  },
  {
    "_id": "67c1c772f27a690ea9c6627f",
    "staffId": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "asdsa",
    "description": "sadsad",
    "value": "12",
    "unit": "percent",
    "startDate": "20/02/2028 16:25:00",
    "endDate": "20/02/2028 16:31:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "28/02/2025 21:25:54",
    "updatedAt": "28/02/2025 21:25:54",
    "__v": 0,
    "id": "67c1c772f27a690ea9c6627f"
  },
  {
    "_id": "67c1cb4d9c27239e93d8e654",
    "staffId": {
      "_id": "67ab88fe9c55b43935bfeb64",
      "userId": {
        "_id": "67ab78859c55b43935bfeb49",
        "fullName": "nhi",
        "email": "nhiphm302@gmail.com",
        "phone": "0903312258",
        "doB": "12/02/2001",
        "avatarUrl": [],
        "isVerifiedEmail": true,
        "__v": 0,
        "id": "67ab78859c55b43935bfeb49",
        "createdAt": "24/03/2025 17:26:03",
        "updatedAt": "24/03/2025 17:26:03"
      },
      "__v": 0,
      "id": "67ab88fe9c55b43935bfeb64",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemCategoryId": {
      "_id": "67b58b0f91b0b3d2b6c11523",
      "categoryKey": "1",
      "categoryName": "te11st",
      "categoryDescription": "drgeg",
      "__v": 0,
      "id": "67b58b0f91b0b3d2b6c11523",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "policySystemBookingId": {
      "_id": "67b58b0091b0b3d2b6c1151f",
      "value": "12",
      "unit": "percent",
      "__v": 0,
      "id": "67b58b0091b0b3d2b6c1151f",
      "createdAt": "24/03/2025 17:26:03",
      "updatedAt": "24/03/2025 17:26:03"
    },
    "name": "test",
    "description": "dsfsdf",
    "value": "234",
    "unit": "vnd",
    "startDate": "28/02/2025 21:42:00",
    "endDate": "01/03/2025 21:42:00",
    "isActive": true,
    "isDelete": false,
    "createdAt": "28/02/2025 21:42:21",
    "updatedAt": "28/02/2025 21:42:21",
    "__v": 0,
    "id": "67c1cb4d9c27239e93d8e654"
  }
];
