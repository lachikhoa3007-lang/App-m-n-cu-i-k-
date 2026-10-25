import { FoodItem, Order, TimeSlotConfig, Voucher, IncidentReport, StockTransferLog } from '../types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  // 18 MÓN CHÍNH (Theo Bảng 9.1 Báo Cáo PT Căn Tin HUTECH)
  {
    id: 1,
    name: 'Phở bò',
    category: 'Món chính',
    price: 39000,
    onlineStock: 28,
    offlineStock: 22,
    minStock: 10,
    active: true,
    description: 'Nước dùng bò hầm thảo mộc thơm ngọt, bánh phở tươi, thịt bò tái/nạm và rau thơm chanh ớt.',
    salesCount: 42
  },
  {
    id: 2,
    name: 'Phở gà',
    category: 'Món chính',
    price: 39000,
    onlineStock: 24,
    offlineStock: 16,
    minStock: 10,
    active: true,
    description: 'Nước dùng gà thanh ngọt đậm đà, thịt gà ta xé phay giòn da, rau thơm ăn kèm.',
    salesCount: 35
  },
  {
    id: 3,
    name: 'Bún bò',
    category: 'Món chính',
    price: 39000,
    onlineStock: 20,
    offlineStock: 20,
    minStock: 10,
    active: true,
    description: 'Bún sợi to, thịt bò bắp, chả cua, nước dùng sa tế sả thơm nồng và rau thơm bắp chuối.',
    salesCount: 48
  },
  {
    id: 4,
    name: 'Mì Quảng',
    category: 'Món chính',
    price: 39000,
    onlineStock: 15,
    offlineStock: 12,
    minStock: 8,
    active: true,
    description: 'Mì Quảng vàng ươm, tôm thịt đậm vị miền Trung, bánh đa giòn rụm và rau sống tươi.',
    salesCount: 26
  },
  {
    id: 5,
    name: 'Hủ tiếu',
    category: 'Món chính',
    price: 39000,
    onlineStock: 22,
    offlineStock: 18,
    minStock: 10,
    active: true,
    description: 'Hủ tiếu dai tôm thịt xá xíu, nước súp xương ngọt thanh, hành phi tỏi thơm lừng.',
    salesCount: 38
  },
  {
    id: 6,
    name: 'Bánh canh',
    category: 'Món chính',
    price: 39000,
    onlineStock: 16,
    offlineStock: 10,
    minStock: 8,
    active: true,
    description: 'Sợi bánh canh dai mềm, nước dùng sền sệt ngọt thanh giò heo tôm chả đậm vị.',
    salesCount: 22
  },
  {
    id: 7,
    name: 'Nui',
    category: 'Món chính',
    price: 39000,
    onlineStock: 12,
    offlineStock: 10,
    minStock: 8,
    active: true,
    description: 'Nui xào hoặc nui sườn hầm rau củ quả bổ dưỡng, hợp bữa sáng và bữa trưa sinh viên.',
    salesCount: 19
  },
  {
    id: 8,
    name: 'Cơm sườn',
    category: 'Món chính',
    price: 39000,
    onlineStock: 8,
    offlineStock: 35,
    minStock: 12,
    active: true,
    description: 'Cơm tấm dẻo thơm, sườn nướng mật ong mềm thấm vị, dưa leo chua ngọt và nước mắm ớt kẹo.',
    salesCount: 74
  },
  {
    id: 9,
    name: 'Cơm gà',
    category: 'Món chính',
    price: 39000,
    onlineStock: 25,
    offlineStock: 20,
    minStock: 10,
    active: true,
    description: 'Cơm chiên gà xối mỡ hoặc gà hấp hành, hạt cơm vàng óng ráo dầu, canh súp ăn kèm.',
    salesCount: 52
  },
  {
    id: 10,
    name: 'Cơm thịt kho trứng',
    category: 'Món chính',
    price: 39000,
    onlineStock: 18,
    offlineStock: 14,
    minStock: 8,
    active: true,
    description: 'Cơm trắng hạt mềm, thịt ba rọi kho trứng vịt đậm đà màu cánh gián chuẩn cơm mẹ nấu.',
    salesCount: 31
  },
  {
    id: 11,
    name: 'Cơm thịt kho tiêu',
    category: 'Món chính',
    price: 39000,
    onlineStock: 15,
    offlineStock: 15,
    minStock: 8,
    active: true,
    description: 'Thịt heo rim tiêu Phú Quốc cay nồng đưa cơm, kèm dưa giá muối chua thanh mát.',
    salesCount: 29
  },
  {
    id: 12,
    name: 'Cơm cá kho',
    category: 'Món chính',
    price: 39000,
    onlineStock: 12,
    offlineStock: 10,
    minStock: 6,
    active: true,
    description: 'Cá hú/cá lóc kho tộ sền sệt nước hàng tiêu ớt, hương vị mặn ngọt truyền thống.',
    salesCount: 18
  },
  {
    id: 13,
    name: 'Cơm cá chiên mắm',
    category: 'Món chính',
    price: 39000,
    onlineStock: 10,
    offlineStock: 15,
    minStock: 6,
    active: true,
    description: 'Cá chiên vàng giòn rụm áo lớp sốt nước mắm tỏi ớt cay ngọt cay tê lưỡi.',
    salesCount: 21
  },
  {
    id: 14,
    name: 'Cơm chiên Dương Châu',
    category: 'Món chính',
    price: 39000,
    onlineStock: 20,
    offlineStock: 16,
    minStock: 8,
    active: true,
    description: 'Cơm chiên tơi xốp cùng lạp xưởng, đậu Hà Lan, cà rốt và trứng gà béo ngậy.',
    salesCount: 45
  },
  {
    id: 15,
    name: 'Cơm đùi gà',
    category: 'Món chính',
    price: 39000,
    onlineStock: 15,
    offlineStock: 16,
    minStock: 8,
    active: true,
    description: 'Đùi gà góc tư nướng sốt tiêu đen hoặc chiên nước mắm đậm đà béo ngậy.',
    salesCount: 36
  },
  {
    id: 16,
    name: 'Cơm má đùi gà',
    category: 'Món chính',
    price: 39000,
    onlineStock: 14,
    offlineStock: 18,
    minStock: 8,
    active: true,
    description: 'Má đùi gà nướng giòn da, thịt ngọt mềm mọng nước, kèm xà lách cà chua.',
    salesCount: 33
  },
  {
    id: 17,
    name: 'Bánh mì',
    category: 'Món chính',
    price: 20000,
    onlineStock: 40,
    offlineStock: 30,
    minStock: 15,
    active: true,
    description: 'Bánh mì nóng giòn rụm với pate gan, thịt nguội, chả lụa, dưa leo ngò rí sốt bơ trứng.',
    salesCount: 65
  },
  {
    id: 18,
    name: 'Bún thịt nướng',
    category: 'Món chính',
    price: 39000,
    onlineStock: 22,
    offlineStock: 14,
    minStock: 10,
    active: true,
    description: 'Bún tươi, thịt nướng than hoa thơm lừng, chả giò giòn tan, đậu phộng mỡ hành nước mắm chua ngọt.',
    salesCount: 41
  },

  // 8 NƯỚC & ĐỒ ĂN VẶT (Theo Bảng 9.2 Báo Cáo PT Căn Tin HUTECH)
  {
    id: 19,
    name: 'Bánh tráng trộn',
    category: 'Nước & Ăn vặt',
    price: 20000,
    onlineStock: 30,
    offlineStock: 30,
    minStock: 10,
    active: true,
    description: 'Bánh tráng phơi sương cắt sợi trộn bò khô, tép khô, trứng cút, xoài băm, rau răm sốt me chua cay.',
    salesCount: 58
  },
  {
    id: 20,
    name: 'Cafe sữa',
    category: 'Nước & Ăn vặt',
    price: 18000,
    onlineStock: 45,
    offlineStock: 40,
    minStock: 15,
    active: true,
    description: 'Cà phê nguyên chất rang mộc pha phin đậm đà kết hợp sữa đặc ngọt thơm, đá sảng khoái.',
    salesCount: 89
  },
  {
    id: 21,
    name: 'Cafe đen',
    category: 'Nước & Ăn vặt',
    price: 15000,
    onlineStock: 38,
    offlineStock: 32,
    minStock: 10,
    active: true,
    description: 'Cà phê đen đá hoặc đen nóng đậm đặc giúp tỉnh táo tập trung tối đa cho tiết học.',
    salesCount: 46
  },
  {
    id: 22,
    name: 'Nước suối',
    category: 'Nước & Ăn vặt',
    price: 7000,
    onlineStock: 95,
    offlineStock: 100,
    minStock: 20,
    active: true,
    description: 'Nước khoáng thiên nhiên tinh khiết đóng chai 500ml ướp lạnh mát lành.',
    salesCount: 110
  },
  {
    id: 23,
    name: 'Sting',
    category: 'Nước & Ăn vặt',
    price: 12000,
    onlineStock: 55,
    offlineStock: 50,
    minStock: 15,
    active: true,
    description: 'Nước tăng lực Sting dâu tây đỏ tươi mát lạnh, giải khát nạp năng lượng nhanh.',
    salesCount: 78
  },
  {
    id: 24,
    name: 'Pepsi',
    category: 'Nước & Ăn vặt',
    price: 12000,
    onlineStock: 48,
    offlineStock: 42,
    minStock: 15,
    active: true,
    description: 'Nước ngọt có gas Pepsi lon 320ml ướp lạnh đã khát tức thì.',
    salesCount: 55
  },
  {
    id: 25,
    name: 'Ô long',
    category: 'Nước & Ăn vặt',
    price: 12000,
    onlineStock: 38,
    offlineStock: 40,
    minStock: 12,
    active: true,
    description: 'Trà Tea+ Ô long vị chanh / nguyên bản thanh mát giải nhiệt mùa thi cử.',
    salesCount: 62
  },
  {
    id: 26,
    name: 'Coca-Cola',
    category: 'Nước & Ăn vặt',
    price: 12000,
    onlineStock: 50,
    offlineStock: 48,
    minStock: 15,
    active: true,
    description: 'Nước giải khát có ga Coca-Cola chính hãng lon mát lạnh.',
    salesCount: 67
  },

  // 3 MÓN THÊM (Theo Bảng 9.3 Báo Cáo PT Căn Tin HUTECH)
  {
    id: 27,
    name: 'Cơm thêm',
    category: 'Món thêm',
    price: 5000,
    onlineStock: 90,
    offlineStock: 100,
    minStock: 20,
    active: true,
    description: 'Thêm một chén cơm trắng dẻo nóng hổi ăn kèm món chính.',
    salesCount: 85
  },
  {
    id: 28,
    name: 'Bún thêm',
    category: 'Món thêm',
    price: 3000,
    onlineStock: 75,
    offlineStock: 80,
    minStock: 20,
    active: true,
    description: 'Thêm một vắt bún tươi sạch cho các món bún bò, phở hoặc hủ tiếu.',
    salesCount: 54
  },
  {
    id: 29,
    name: 'Trứng thêm',
    category: 'Món thêm',
    price: 5000,
    onlineStock: 55,
    offlineStock: 60,
    minStock: 15,
    active: true,
    description: 'Thêm 1 quả trứng ốp la lòng đào hoặc trứng kho thấm vị.',
    salesCount: 72
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'DH101',
    studentId: '24808900033',
    studentName: 'La Chí Khoa',
    studentPhone: '0908123456',
    deliveryLocation: 'Tòa E1 - Tầng 2 Khu tự học sinh viên',
    timeSlot: '11:15 - 12:00',
    paymentMethod: 'ONLINE',
    isPaid: true,
    items: [
      { foodId: 1, foodName: 'Phở bò', quantity: 1, price: 39000, notes: 'Ít hành, nhiều tương đen' },
      { foodId: 20, foodName: 'Cafe sữa', quantity: 1, price: 18000, notes: 'Nhiều đá, ít ngọt' }
    ],
    subtotal: 57000,
    discount: 0,
    total: 57000,
    status: 'preparing',
    createdAt: '10:45:12 - Hôm nay',
    updatedAt: '10:48:30 - Hôm nay'
  },
  {
    id: 'DH102',
    studentId: '24808900014',
    studentName: 'Bùi Thành Đạt',
    studentPhone: '0912345678',
    deliveryLocation: 'Tòa E2 - Tầng 3 Phòng máy E2-03.01',
    timeSlot: '11:15 - 12:00',
    paymentMethod: 'COD',
    isPaid: false,
    items: [
      { foodId: 8, foodName: 'Cơm sườn', quantity: 2, price: 39000, notes: 'Nước mắm ngọt nhiều ớt' },
      { foodId: 23, foodName: 'Sting', quantity: 1, price: 12000 },
      { foodId: 27, foodName: 'Cơm thêm', quantity: 1, price: 5000 }
    ],
    subtotal: 95000,
    discount: 10000,
    voucherCode: 'HUTECHSTART',
    total: 85000,
    status: 'pending',
    createdAt: '10:52:05 - Hôm nay',
    updatedAt: '10:52:05 - Hôm nay'
  },
  {
    id: 'DH103',
    studentId: '24808900412',
    studentName: 'Nguyễn Thị Mai',
    studentPhone: '0933556789',
    deliveryLocation: 'Thư viện Khu E - Bàn đọc tầng 1',
    timeSlot: '11:15 - 12:00',
    paymentMethod: 'ONLINE',
    isPaid: true,
    items: [
      { foodId: 18, foodName: 'Bún thịt nướng', quantity: 1, price: 39000 },
      { foodId: 25, foodName: 'Ô long', quantity: 1, price: 12000 }
    ],
    subtotal: 51000,
    discount: 0,
    total: 51000,
    status: 'ready',
    createdAt: '10:35:10 - Hôm nay',
    updatedAt: '10:55:00 - Hôm nay'
  },
  {
    id: 'DH104',
    studentId: '24808900998',
    studentName: 'Trần Văn Hoàng',
    studentPhone: '0977889900',
    deliveryLocation: 'Sảnh Căn Tin Khu E (Nhận tại quầy số 2)',
    timeSlot: '10:30 - 11:15',
    paymentMethod: 'ONLINE',
    isPaid: true,
    items: [
      { foodId: 9, foodName: 'Cơm gà', quantity: 1, price: 39000 },
      { foodId: 22, foodName: 'Nước suối', quantity: 1, price: 7000 }
    ],
    subtotal: 46000,
    discount: 0,
    total: 46000,
    status: 'completed',
    createdAt: '10:15:00 - Hôm nay',
    updatedAt: '10:40:20 - Hôm nay'
  }
];

export const INITIAL_TIME_SLOTS: TimeSlotConfig[] = [
  {
    id: 'slot-1',
    timeRange: '10:30 - 11:15',
    label: 'Ca trưa sớm (Tan tiết 4)',
    maxCapacity: 40,
    currentOrders: 24,
    isLocked: false
  },
  {
    id: 'slot-2',
    timeRange: '11:15 - 12:00',
    label: 'Cao điểm 1 (Tan tiết 5)',
    maxCapacity: 60,
    currentOrders: 54, // ~90% -> cảnh báo mức cao
    isLocked: false
  },
  {
    id: 'slot-3',
    timeRange: '12:00 - 12:45',
    label: 'Cao điểm 2 (Nghỉ trưa ca chính)',
    maxCapacity: 50,
    currentOrders: 32,
    isLocked: false
  },
  {
    id: 'slot-4',
    timeRange: '12:45 - 13:30',
    label: 'Ca trưa muộn (Vào ca chiều)',
    maxCapacity: 30,
    currentOrders: 10,
    isLocked: false
  },
  {
    id: 'slot-5',
    timeRange: '16:30 - 17:30',
    label: 'Ca xế chiều (Tan học chiều)',
    maxCapacity: 35,
    currentOrders: 8,
    isLocked: false
  }
];

export const HUTECH_LOCATIONS: string[] = [
  'Sảnh Căn Tin Khu E (Nhận món trực tiếp tại quầy 1)',
  'Sảnh Căn Tin Khu E (Nhận món trực tiếp tại quầy 2)',
  'Tòa E1 - Tầng 1: Văn phòng Giảng viên / Nghiên cứu',
  'Tòa E1 - Tầng 2: Khu tự học sinh viên (Bàn trung tâm)',
  'Tòa E1 - Tầng 3: Hành lang phòng học E1-03',
  'Tòa E1 - Tầng 4: Phòng học E1-04.02',
  'Tòa E2 - Tầng 1: Sảnh lễ tân & Hội trường lớn',
  'Tòa E2 - Tầng 2: Khu thí nghiệm công nghệ cao',
  'Tòa E2 - Tầng 3: Phòng thực hành máy tính E2-03',
  'Tòa E3 - Tầng trệt: Không gian khởi nghiệp Innovation Hub',
  'Thư viện Khu E: Khu vực bàn đọc lầu 1 (Giao cửa ngoài)',
  'Khu thể thao Khu E: Sân bóng rổ / Nhà thi đấu'
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    code: 'HUTECHSTART',
    title: 'Giảm 10.000₫ đơn từ 40k',
    discountAmount: 10000,
    minSpend: 40000,
    isActive: true,
    usedCount: 142
  },
  {
    code: 'TIETKIEM15',
    title: 'Giảm 15% tối đa 15.000₫',
    discountPercent: 15,
    minSpend: 35000,
    isActive: true,
    usedCount: 89
  },
  {
    code: 'FREESHIPKHUE',
    title: 'Miễn phí giao hàng nội khu',
    discountAmount: 5000,
    minSpend: 30000,
    isActive: true,
    usedCount: 230
  }
];

export const INITIAL_TRANSFER_LOGS: StockTransferLog[] = [
  {
    id: 'LOG-001',
    timestamp: '09:40:15',
    foodId: 8,
    foodName: 'Cơm sườn',
    direction: 'offline_to_online',
    amount: 10,
    reason: 'Đơn Online tăng đột biến giờ tan tiết 4',
    authorizedBy: 'Quản lý (quantricantin)'
  },
  {
    id: 'LOG-002',
    timestamp: '10:15:30',
    foodId: 1,
    foodName: 'Phở bò',
    direction: 'online_to_offline',
    amount: 5,
    reason: 'Khách trực tiếp tại quầy xếp hàng đông, điều chuyển bổ sung quầy',
    authorizedBy: 'Quản lý (quantricantin)'
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'INC-201',
    orderId: 'DH098',
    studentId: '24808900155',
    issueType: 'out_of_stock',
    description: 'Hết bún bò do nồi nước dùng cạn sớm, khách đồng ý đổi sang Phở bò',
    resolution: 'replace',
    status: 'resolved',
    createdAt: '09:50 - Hôm nay'
  },
  {
    id: 'INC-202',
    orderId: 'DH099',
    studentId: '24808900210',
    issueType: 'delivery_failed',
    description: 'Sinh viên bận thuyết trình không bắt máy, shipper chờ 15 phút tại E2 tầng 3',
    resolution: 'refund',
    refundAmount: 39000,
    status: 'resolved',
    createdAt: '10:20 - Hôm nay'
  }
];
