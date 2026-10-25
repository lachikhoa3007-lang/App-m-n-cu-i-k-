import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FoodItem, Order, OrderStatus, TimeSlotConfig, StockTransferLog, Voucher, IncidentReport } from '../types';
import { 
  INITIAL_FOOD_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_TIME_SLOTS, 
  INITIAL_TRANSFER_LOGS, 
  INITIAL_VOUCHERS, 
  INITIAL_INCIDENTS 
} from '../data/initialData';

interface CanteenContextType {
  foodItems: FoodItem[];
  orders: Order[];
  timeSlots: TimeSlotConfig[];
  transferLogs: StockTransferLog[];
  vouchers: Voucher[];
  incidents: IncidentReport[];
  isStoreOpen: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setStoreOpen: (open: boolean) => void;
  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => { success: boolean; message: string; orderId?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  // Inventory actions
  transferStock: (foodId: number, direction: 'offline_to_online' | 'online_to_offline', amount: number, reason: string) => boolean;
  recordDirectOfflineSale: (foodId: number, quantity: number) => boolean;
  adjustStockDirectly: (foodId: number, onlineChange: number, offlineChange: number, reason: string) => void;
  updateStockValues: (foodId: number, newOnline: number, newOffline: number, newMinStock: number, reason: string) => void;
  // Menu actions
  toggleFoodActive: (foodId: number) => void;
  updateFoodPrice: (foodId: number, newPrice: number) => void;
  addFoodItem: (item: Omit<FoodItem, 'id' | 'salesCount'>) => void;
  // Capacity actions
  toggleSlotLock: (slotId: string) => void;
  updateSlotCapacity: (slotId: string, newMax: number) => void;
  // Incident & Vouchers
  resolveIncident: (incidentId: string) => void;
  createIncidentReport: (incident: Omit<IncidentReport, 'id' | 'createdAt' | 'status'>) => void;
  resetDatabase: () => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

// Web Audio sound generator for new order chime
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // ShopeeFood chime sound (Two pleasant harmonious tones: 587.33Hz D5 -> 880Hz A5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.45);
  } catch {
    // AudioContext might be blocked until user interacts
  }
};

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('hutech_canteen_foods');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hutech_canteen_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlotConfig[]>(() => {
    const saved = localStorage.getItem('hutech_canteen_slots');
    return saved ? JSON.parse(saved) : INITIAL_TIME_SLOTS;
  });

  const [transferLogs, setTransferLogs] = useState<StockTransferLog[]>(() => {
    const saved = localStorage.getItem('hutech_canteen_logs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFER_LOGS;
  });

  const [vouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('hutech_canteen_vouchers');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('hutech_canteen_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('hutech_canteen_store_open');
    return saved ? JSON.parse(saved) : true;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('hutech_canteen_foods', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('hutech_canteen_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hutech_canteen_slots', JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem('hutech_canteen_logs', JSON.stringify(transferLogs));
  }, [transferLogs]);

  useEffect(() => {
    localStorage.setItem('hutech_canteen_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('hutech_canteen_store_open', JSON.stringify(isStoreOpen));
  }, [isStoreOpen]);

  // Listen to cross-window or tab changes if opened in multiple instances
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'hutech_canteen_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      } else if (e.key === 'hutech_canteen_foods' && e.newValue) {
        setFoodItems(JSON.parse(e.newValue));
      } else if (e.key === 'hutech_canteen_slots' && e.newValue) {
        setTimeSlots(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Atomic Order Creation with Inventory Hold & Capacity Check (Chương 6.2)
  const placeOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    if (!isStoreOpen) {
      return { success: false, message: 'Căn tin hiện đang tạm ngưng nhận đơn đặt món mới.' };
    }

    // 1. Verify Slot Capacity (BR06)
    const targetSlot = timeSlots.find(s => s.timeRange === orderData.timeSlot);
    if (!targetSlot) {
      return { success: false, message: 'Khung giờ nhận món không hợp lệ.' };
    }
    if (targetSlot.isLocked || targetSlot.currentOrders >= targetSlot.maxCapacity) {
      return { success: false, message: `Khung giờ ${orderData.timeSlot} đã đạt giới hạn công suất tiếp nhận đơn!` };
    }

    // 2. Check Atomic Inventory Hold (BR02, BR03)
    for (const item of orderData.items) {
      const food = foodItems.find(f => f.id === item.foodId);
      if (!food || !food.active) {
        return { success: false, message: `Món "${item.foodName}" hiện không phục vụ.` };
      }
      if (food.onlineStock < item.quantity) {
        return { 
          success: false, 
          message: `Món "${food.name}" chỉ còn ${food.onlineStock} phần tồn Online, không đủ đáp ứng số lượng bạn đặt (${item.quantity} phần). Vui lòng điều chỉnh lại giỏ hàng!` 
        };
      }
    }

    // 3. Atomically Deduct Online Stock & Increment Sales
    setFoodItems(prev => prev.map(food => {
      const ordered = orderData.items.find(i => i.foodId === food.id);
      if (ordered) {
        return {
          ...food,
          onlineStock: food.onlineStock - ordered.quantity,
          salesCount: food.salesCount + ordered.quantity
        };
      }
      return food;
    }));

    // 4. Increment Slot Order Count
    setTimeSlots(prev => prev.map(slot => {
      if (slot.id === targetSlot.id) {
        return {
          ...slot,
          currentOrders: slot.currentOrders + 1
        };
      }
      return slot;
    }));

    // 5. Generate Order Code
    const orderNum = Math.floor(100 + Math.random() * 900);
    const newOrderId = `DH${orderNum}`;
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' - Hôm nay';

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setOrders(prev => [newOrder, ...prev]);

    // 6. Play Notification Sound
    if (soundEnabled) {
      playNotificationSound();
    }

    return { 
      success: true, 
      message: `Đặt đơn thành công! Mã đơn của bạn là #${newOrderId}`, 
      orderId: newOrderId 
    };
  }, [foodItems, isStoreOpen, soundEnabled, timeSlots]);

  // Update order status & Handle cancellations (BR13)
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, reason?: string) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay';

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        // If order is cancelled and was only pending (not yet preparing/ready), restore held stock (BR13)
        if (status === 'cancelled' && ord.status === 'pending') {
          setFoodItems(foods => foods.map(f => {
            const item = ord.items.find(i => i.foodId === f.id);
            if (item) {
              return {
                ...f,
                onlineStock: f.onlineStock + item.quantity,
                salesCount: Math.max(0, f.salesCount - item.quantity)
              };
            }
            return f;
          }));

          // Decrement slot current orders
          setTimeSlots(slots => slots.map(s => {
            if (s.timeRange === ord.timeSlot) {
              return { ...s, currentOrders: Math.max(0, s.currentOrders - 1) };
            }
            return s;
          }));
        }

        return {
          ...ord,
          status,
          updatedAt: timestamp,
          cancelReason: reason || ord.cancelReason
        };
      }
      return ord;
    }));
  }, []);

  // Smart Stock Balancing: Transfer stock between Online and Offline (BR09, Chương 6.5)
  const transferStock = useCallback((
    foodId: number, 
    direction: 'offline_to_online' | 'online_to_offline', 
    amount: number, 
    reason: string
  ): boolean => {
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return false;

    if (direction === 'offline_to_online') {
      if (food.offlineStock < amount) return false;
      setFoodItems(prev => prev.map(f => f.id === foodId ? {
        ...f,
        onlineStock: f.onlineStock + amount,
        offlineStock: f.offlineStock - amount
      } : f));
    } else {
      if (food.onlineStock < amount) return false;
      setFoodItems(prev => prev.map(f => f.id === foodId ? {
        ...f,
        onlineStock: f.onlineStock - amount,
        offlineStock: f.offlineStock + amount
      } : f));
    }

    const log: StockTransferLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      foodId,
      foodName: food.name,
      direction,
      amount,
      reason: reason || 'Điều chuyển cân bằng nhu cầu phục vụ',
      authorizedBy: 'Quản trị viên (quantricantin)'
    };

    setTransferLogs(prev => [log, ...prev]);
    return true;
  }, [foodItems]);

  // Direct offline POS sales at counter (BR04: Giao dịch offline làm giảm tồn Offline)
  const recordDirectOfflineSale = useCallback((foodId: number, quantity: number): boolean => {
    const food = foodItems.find(f => f.id === foodId);
    if (!food || food.offlineStock < quantity) return false;

    setFoodItems(prev => prev.map(f => f.id === foodId ? {
      ...f,
      offlineStock: f.offlineStock - quantity,
      salesCount: f.salesCount + quantity
    } : f));
    return true;
  }, [foodItems]);

  // Adjust stock directly with reason (BR08)
  const adjustStockDirectly = useCallback((foodId: number, onlineChange: number, offlineChange: number, reason: string) => {
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return;

    setFoodItems(prev => prev.map(f => f.id === foodId ? {
      ...f,
      onlineStock: Math.max(0, f.onlineStock + onlineChange),
      offlineStock: Math.max(0, f.offlineStock + offlineChange)
    } : f));

    const log: StockTransferLog = {
      id: `ADJ-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      foodId,
      foodName: food.name,
      direction: onlineChange >= 0 ? 'offline_to_online' : 'online_to_offline',
      amount: Math.abs(onlineChange || offlineChange),
      reason: `Điều chỉnh thủ công: ${reason}`,
      authorizedBy: 'Quản lý (quantricantin)'
    };
    setTransferLogs(prev => [log, ...prev]);
  }, [foodItems]);

  // Set explicit custom stock values (Tùy chỉnh tồn kho riêng từng kênh - BR08)
  const updateStockValues = useCallback((
    foodId: number, 
    newOnline: number, 
    newOffline: number, 
    newMinStock: number, 
    reason: string
  ) => {
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return;

    const oldOnline = food.onlineStock;
    const oldOffline = food.offlineStock;

    setFoodItems(prev => prev.map(f => f.id === foodId ? {
      ...f,
      onlineStock: Math.max(0, newOnline),
      offlineStock: Math.max(0, newOffline),
      minStock: Math.max(1, newMinStock)
    } : f));

    const totalChange = Math.abs(newOnline - oldOnline) + Math.abs(newOffline - oldOffline);
    const log: StockTransferLog = {
      id: `ADJ-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      foodId,
      foodName: food.name,
      direction: newOnline >= oldOnline ? 'offline_to_online' : 'online_to_offline',
      amount: totalChange,
      reason: `Tùy chỉnh kho riêng: ${reason} (Online: ${oldOnline}➔${newOnline}, Quầy: ${oldOffline}➔${newOffline}, Tối thiểu: ${newMinStock})`,
      authorizedBy: 'Quản trị viên (quantricantin)'
    };
    setTransferLogs(prev => [log, ...prev]);
  }, [foodItems]);

  // Toggle food active
  const toggleFoodActive = useCallback((foodId: number) => {
    setFoodItems(prev => prev.map(f => f.id === foodId ? { ...f, active: !f.active } : f));
  }, []);

  // Update food price
  const updateFoodPrice = useCallback((foodId: number, newPrice: number) => {
    setFoodItems(prev => prev.map(f => f.id === foodId ? { ...f, price: newPrice } : f));
  }, []);

  // Add new food item
  const addFoodItem = useCallback((item: Omit<FoodItem, 'id' | 'salesCount'>) => {
    const newId = Math.max(...foodItems.map(f => f.id), 0) + 1;
    const newItem: FoodItem = {
      ...item,
      id: newId,
      salesCount: 0
    };
    setFoodItems(prev => [...prev, newItem]);
  }, [foodItems]);

  // Toggle slot lock (BR06, BR12)
  const toggleSlotLock = useCallback((slotId: string) => {
    setTimeSlots(prev => prev.map(s => s.id === slotId ? { ...s, isLocked: !s.isLocked } : s));
  }, []);

  // Update slot max capacity
  const updateSlotCapacity = useCallback((slotId: string, newMax: number) => {
    setTimeSlots(prev => prev.map(s => s.id === slotId ? { ...s, maxCapacity: newMax } : s));
  }, []);

  // Incident reports (Chương 6.6)
  const createIncidentReport = useCallback((incident: Omit<IncidentReport, 'id' | 'createdAt' | 'status'>) => {
    const newInc: IncidentReport = {
      ...incident,
      id: `INC-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay',
      status: 'pending'
    };
    setIncidents(prev => [newInc, ...prev]);
  }, []);

  const resolveIncident = useCallback((incidentId: string) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'resolved' } : i));
  }, []);

  // Reset database to initial report data
  const resetDatabase = useCallback(() => {
    setFoodItems(INITIAL_FOOD_ITEMS);
    setOrders(INITIAL_ORDERS);
    setTimeSlots(INITIAL_TIME_SLOTS);
    setTransferLogs(INITIAL_TRANSFER_LOGS);
    setIncidents(INITIAL_INCIDENTS);
    setIsStoreOpen(true);
    localStorage.removeItem('hutech_canteen_foods');
    localStorage.removeItem('hutech_canteen_orders');
    localStorage.removeItem('hutech_canteen_slots');
    localStorage.removeItem('hutech_canteen_logs');
    localStorage.removeItem('hutech_canteen_incidents');
    localStorage.removeItem('hutech_canteen_store_open');
  }, []);

  return (
    <CanteenContext.Provider
      value={{
        foodItems,
        orders,
        timeSlots,
        transferLogs,
        vouchers,
        incidents,
        isStoreOpen,
        soundEnabled,
        setSoundEnabled,
        setStoreOpen: setIsStoreOpen,
        placeOrder,
        updateOrderStatus,
        transferStock,
        recordDirectOfflineSale,
        adjustStockDirectly,
        updateStockValues,
        toggleFoodActive,
        updateFoodPrice,
        addFoodItem,
        toggleSlotLock,
        updateSlotCapacity,
        resolveIncident,
        createIncidentReport,
        resetDatabase
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
