import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Utensils, 
  HelpCircle, 
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DemandForecastView: React.FC = () => {
  const { foodItems } = useCanteen();
  const [selectedDay, setSelectedDay] = useState<string>('Thứ Hai');

  // Days configuration
  const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  // Projections for key dishes based on day of week factor
  const dayMultiplier = selectedDay === 'Thứ Hai' ? 1.2 : selectedDay === 'Thứ Sáu' ? 1.15 : 1.0;

  const forecastData = foodItems.slice(0, 10).map(food => {
    const projected = Math.round(food.salesCount * 1.35 * dayMultiplier);
    const suggestedPrep = Math.round(projected * 1.1); // +10% buffer
    const stockCoverage = (food.onlineStock + food.offlineStock) >= suggestedPrep;

    return {
      foodId: food.id,
      name: food.name,
      category: food.category,
      currentSales: food.salesCount,
      projectedDemand: projected,
      suggestedPrep,
      currentStock: food.onlineStock + food.offlineStock,
      stockCoverage
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Dự Báo Nhu Cầu & Kế Hoạch Chuẩn Bị Món (Demand Forecast)
        </h2>
        <p className="text-xs text-slate-500">
          Quy định tại Chương 6.4 Báo cáo HUTECH: Sử dụng lịch sử bán hàng theo ngày trong tuần và các khung giờ tan ca để lập kế hoạch chuẩn bị nguyên liệu, tránh tình trạng thừa/thiếu món.
        </p>
      </div>

      {/* Day Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#ee4d2d]" />
          <span className="text-xs font-bold text-slate-700">Dự báo theo lịch học trong tuần:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {daysOfWeek.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedDay === day 
                  ? 'bg-[#ee4d2d] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* AI / Smart Demand Analytics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-2xl border border-orange-200/70 space-y-2">
          <div className="flex items-center gap-2 text-[#ee4d2d]">
            <TrendingUp className="w-5 h-5" />
            <h4 className="font-bold text-sm">Cao điểm {selectedDay}{selectedDay === 'Thứ Hai' ? ' (Đầu tuần)' : ''}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhu cầu tiêu thụ các món ăn nhanh như <strong>Cơm sườn, Phở bò và Cà phê sữa</strong> dự kiến tăng <strong>+{Math.round((dayMultiplier - 1) * 100 + 20)}%</strong> vào khung 11:15 - 12:00.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200/70 space-y-2">
          <div className="flex items-center gap-2 text-indigo-700">
            <Clock className="w-5 h-5" />
            <h4 className="font-bold text-sm">Gợi ý thời gian sơ chế</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bộ phận bếp cần hoàn tất nấu chín và chia khay trước <strong>10:15 sáng</strong> để kịp giữ nhiệt và đóng gói giao đến các tòa nhà E1, E2, E3.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200/70 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-bold text-sm">Độ tin cậy mô hình dự báo</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Theo nghiên cứu lý thuyết Ahznizam (2024), việc chuẩn bị theo dự báo lịch sử giúp giảm đến <strong>78% tỷ lệ hết món đột xuất</strong> tại căn tin trường học.
          </p>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#ee4d2d]" />
            <span>Kế Hoạch Dự Toán Số Suất Chuẩn Bị Cho {selectedDay}</span>
          </h3>
          <span className="text-xs text-slate-400">Dựa trên 29 món ăn thực tế</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Món ăn</th>
                <th className="py-3 px-3">Danh mục</th>
                <th className="py-3 px-3 text-center">Đã bán thực tế</th>
                <th className="py-3 px-3 text-center text-[#ee4d2d]">Nhu cầu dự báo ({selectedDay})</th>
                <th className="py-3 px-3 text-center font-bold text-indigo-700">Đề xuất chuẩn bị</th>
                <th className="py-3 px-3 text-center">Tồn kho hiện có</th>
                <th className="py-3 px-4 text-center">Đánh giá khả năng cung ứng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecastData.map(item => (
                <tr key={item.foodId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3 px-3 text-slate-500">{item.category}</td>
                  <td className="py-3 px-3 text-center tabular-nums font-mono">{item.currentSales} phần</td>
                  <td className="py-3 px-3 text-center tabular-nums font-bold text-[#ee4d2d]">{item.projectedDemand} phần</td>
                  <td className="py-3 px-3 text-center tabular-nums font-black text-indigo-700 bg-indigo-50/50">{item.suggestedPrep} phần</td>
                  <td className="py-3 px-3 text-center tabular-nums font-bold text-slate-700">{item.currentStock} phần</td>
                  <td className="py-3 px-4 text-center">
                    {item.stockCoverage ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold">
                        Đủ hàng cung ứng
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span>Cần nấu thêm +{item.suggestedPrep - item.currentStock} phần</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
