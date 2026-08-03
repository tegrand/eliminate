import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../worker/api/worker.api";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, 
  isAfter, isBefore, startOfDay, parseISO 
} from "date-fns";

export default function SlotCalendarPicker({ workerId, startDate, endDate, onChange }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const { data: availabilityResponse, isLoading } = useQuery({
    queryKey: ["workerAvailability", workerId],
    queryFn: () => workerApi.getWorkerAvailability(workerId),
    enabled: isOpen && !!workerId,
  });

  const bookedDates = availabilityResponse?.data || [];

  const isDateBooked = (date) => {
    return bookedDates.some(slot => {
      const start = startOfDay(new Date(slot.startDate));
      const end = startOfDay(new Date(slot.endDate));
      const d = startOfDay(date);
      return (d >= start && d <= end);
    });
  };

  const isPastDate = (date) => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  };

  const handleDateClick = (date) => {
    if (isDateBooked(date) || isPastDate(date)) return;

    if (!startDate || (startDate && endDate) || isBefore(date, startDate)) {
      onChange(date, null);
    } else {
      // Check if there's any booked date between startDate and selected date
      let current = addDays(startDate, 1);
      let isValidRange = true;
      while (isBefore(current, date) || isSameDay(current, date)) {
        if (isDateBooked(current)) {
          isValidRange = false;
          break;
        }
        current = addDays(current, 1);
      }

      if (isValidRange) {
        onChange(startDate, date);
        setIsOpen(false);
      } else {
        // Reset to new start date if invalid range
        onChange(date, null);
      }
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-3">
        <button 
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-xs font-bold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button 
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-[10px] font-semibold text-gray-400 mb-1">
          {format(addDays(startDate, i), "EEEEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart);
    const endDateGrid = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDateGrid;
    let formattedDate = "";

    while (day <= endDateGrid) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isSelectedStart = startDate && isSameDay(day, startDate);
        const isSelectedEnd = endDate && isSameDay(day, endDate);
        const isInRange = startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);
        const isBooked = isDateBooked(day);
        const isPast = isPastDate(day);
        const disabled = isBooked || isPast;

        let cellClasses = "flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium mx-auto cursor-pointer transition-colors ";

        if (!isSameMonth(day, monthStart)) {
          cellClasses += "text-gray-300 pointer-events-none ";
        } else if (disabled) {
          cellClasses += "bg-gray-100 text-gray-300 cursor-not-allowed ";
        } else if (isSelectedStart || isSelectedEnd) {
          cellClasses += "bg-blue-600 text-white shadow-md ";
        } else if (isInRange) {
          cellClasses += "bg-blue-100 text-blue-700 rounded-none w-full ";
        } else {
          cellClasses += "text-gray-700 hover:bg-gray-100 ";
        }

        days.push(
          <div key={day} className="py-0.5">
            <div
              className={cellClasses}
              onClick={() => !disabled && handleDateClick(cloneDay)}
              title={isBooked ? "Worker is booked on this date" : ""}
            >
              {formattedDate}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const displayDate = startDate 
    ? `${format(startDate, "MMM d, yyyy")}${endDate ? ` - ${format(endDate, "MMM d, yyyy")}` : ""}`
    : "Select Dates";

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Booking Slot *
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl border border-gray-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white transition-all text-left"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className={startDate ? "text-gray-900" : "text-gray-400"}>
            {displayDate}
          </span>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 w-[260px] left-0 animate-fade-in origin-top-left">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl backdrop-blur-sm">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-50">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Slot</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-200"></div>
                <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">Booked</span>
              </div>
              <button 
                type="button" 
                onClick={() => { onChange(null, null); setIsOpen(false); }}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
