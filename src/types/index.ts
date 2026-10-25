export type FoodCategory = 'Món chính' | 'Nước & Ăn vặt' | 'Món thêm';

export interface FoodItem {
  id: number;
  name: string;
  category: FoodCategory;
  price: number;
  onlineStock: number;
  offlineStock: number;
  minStock: number;
  active: boolean;
  description: string;
  image?: string;
  salesCount: number;
}

export type OrderStatus = 
  | 'pending'      // Mới đặt, chờ căn tin xác nhận
  | 'preparing'    // Đang chế biến
  | 'ready'        // Sẵn sàng nhận / Chờ giao
  | 'delivering'   // Đang giao nội khu
  | 'completed'    // Hoàn tất
  | 'cancelled';   // Đã hủy

export type PaymentMethod = 'ONLINE' | 'COD';

export interface OrderItemDetail {
  foodId: number;
  foodName: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;               // e.g. "DH101"
  studentId: string;        // MSSV, e.g. "24808900033"
  studentName: string;
  studentPhone: string;
  deliveryLocation: string; // e.g. "Tòa E1 - Tầng 2 Khu tự học"
  timeSlot: string;         // e.g. "11:15 - 12:00"
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  items: OrderItemDetail[];
  subtotal: number;
  discount: number;
  voucherCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  cancelReason?: string;
}

export interface TimeSlotConfig {
  id: string;
  timeRange: string;
  label: string;
  maxCapacity: number;
  currentOrders: number;
  isLocked: boolean;
}

export interface StockTransferLog {
  id: string;
  timestamp: string;
  foodId: number;
  foodName: string;
  direction: 'offline_to_online' | 'online_to_offline';
  amount: number;
  reason: string;
  authorizedBy: string;
}

export interface Voucher {
  code: string;
  title: string;
  discountAmount?: number;
  discountPercent?: number;
  minSpend: number;
  isActive: boolean;
  usedCount: number;
}

export interface IncidentReport {
  id: string;
  orderId: string;
  studentId: string;
  issueType: 'out_of_stock' | 'wrong_dish' | 'delivery_failed' | 'late_delivery' | 'quality_issue';
  description: string;
  resolution: 'refund' | 'replace' | 'voucher_compensation';
  status: 'pending' | 'resolved';
  createdAt: string;
  refundAmount?: number;
}

export interface DemandForecast {
  foodId: number;
  foodName: string;
  category: FoodCategory;
  averageDailySales: number;
  peakHourDemand: number;
  suggestedPrepCount: number;
  trend: 'up' | 'stable' | 'down';
}
