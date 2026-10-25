import React from 'react';
import { 
  Store, 
  Bell, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  User, 
  Smartphone, 
  LayoutDashboard, 
  SplitSquareVertical 
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

interface ShopeeHeaderProps {
  currentView: 'admin' | 'customer' | 'dual';
  setCurrentView: (view: 'admin' | 'customer' | 'dual') => void;
  pendingCount: number;
}

export const ShopeeHeader: React.FC<ShopeeHeaderProps> = ({ 
  currentView, 
  setCurrentView,
  pendingCount 
}) => {
  const { isStoreOpen, setStoreOpen, soundEnabled, setSoundEnabled, resetDatabase } = useCanteen();

  return (
    <header className="sticky top-0 z-50 bg-[#ee4d2d] text-white shadow-md border-b border-red-700">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Canteen Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-[#ee4d2d] shadow-sm font-black text-xl">
              <Store className="w-6 h-6 text-[#ee4d2d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">Căn Tin HUTECH</span>
                <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded text-white uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                Khu E - Đại Học Công Nghệ TP.HCM (Thủ Đức - XL Hà Nội)
              </p>
            </div>
          </div>

          {/* Quick View Switcher (Linked with Customer App) */}
          <div className="hidden md:flex items-center bg-black/20 p-1 rounded-xl gap-1 border border-white/10">
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'admin' 
                  ? 'bg-white text-[#ee4d2d] shadow-sm' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Trang Quản Trị</span>
            </button>
            <button
              onClick={() => setCurrentView('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'customer' 
                  ? 'bg-white text-[#ee4d2d] shadow-sm' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Sinh Viên Đặt Món</span>
            </button>
            <button
              onClick={() => setCurrentView('dual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'dual' 
                  ? 'bg-white text-[#ee4d2d] shadow-sm' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Xem song song 2 màn hình để thử nghiệm đồng bộ thời gian thực"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Xem Song Song (Live Sync)</span>
            </button>
          </div>

          {/* Canteen Status Toggle & Admin Actions */}
          <div className="flex items-center gap-3">
            {/* Store Status Toggle */}
            <div className="flex items-center bg-black/20 px-3 py-1.5 rounded-lg gap-2 text-xs font-medium border border-white/10">
              <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className="hidden sm:inline">
                {isStoreOpen ? 'Đang nhận đơn' : 'Tạm đóng nhận đơn'}
              </span>
              <button
                onClick={() => setStoreOpen(!isStoreOpen)}
                className={`text-[11px] px-2 py-0.5 rounded font-bold transition-all ${
                  isStoreOpen 
                    ? 'bg-white text-[#ee4d2d] hover:bg-slate-100' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {isStoreOpen ? 'Đóng' : 'Mở lại'}
              </button>
            </div>

            {/* Sound Notification Alert Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Chuông báo đơn mới đang BẬT' : 'Chuông báo đơn mới đang TẮT'}
              className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/60" />}
            </button>

            {/* Pending Orders Counter */}
            <div className="relative p-2 rounded-lg bg-white/15">
              <Bell className="w-4 h-4 text-white" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-300 text-slate-900 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {pendingCount}
                </span>
              )}
            </div>

            {/* Reset mock database tool */}
            <button
              onClick={() => {
                if (window.confirm('Khôi phục lại dữ liệu mẫu gốc từ Báo cáo HUTECH?')) {
                  resetDatabase();
                }
              }}
              title="Khôi phục dữ liệu mẫu ban đầu"
              className="hidden lg:flex p-2 rounded-lg bg-white/15 hover:bg-white/25 transition text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Admin Profile Details */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold leading-tight">La Chí Khoa</div>
                <div className="text-[10px] text-white/80 font-mono">24808900033 · Admin</div>
              </div>
            </div>

          </div>

        </div>
      </div>
      
      {/* Mobile Switcher Strip */}
      <div className="md:hidden flex items-center justify-around bg-red-800/60 py-1.5 px-4 text-xs font-semibold">
        <button
          onClick={() => setCurrentView('admin')}
          className={`px-3 py-1 rounded ${currentView === 'admin' ? 'bg-white text-[#ee4d2d]' : 'text-white'}`}
        >
          Quản Trị
        </button>
        <button
          onClick={() => setCurrentView('customer')}
          className={`px-3 py-1 rounded ${currentView === 'customer' ? 'bg-white text-[#ee4d2d]' : 'text-white'}`}
        >
          Đặt Món
        </button>
        <button
          onClick={() => setCurrentView('dual')}
          className={`px-3 py-1 rounded ${currentView === 'dual' ? 'bg-white text-[#ee4d2d]' : 'text-white'}`}
        >
          Song Song
        </button>
      </div>
    </header>
  );
};
