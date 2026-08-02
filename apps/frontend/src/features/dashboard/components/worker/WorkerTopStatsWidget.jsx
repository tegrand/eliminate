import { useTranslation } from "react-i18next";
import DashboardCard from "../DashboardCard";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WorkerTopStatsWidget({ stats }) {
  const { t } = useTranslation();
  
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!stats) return null;

  const cards = [
    {
      title: t('workerDashboard.completedWork') || "Completed Work",
      value: stats.totalCompletedWork || "0",
      description: t('workerDashboard.tasksCompleted') || "Tasks completed",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: t('workerDashboard.totalRevenue') || "Total Revenue",
      value: stats.totalRevenue || "₹0",
      description: t('workerDashboard.thisMonth') || "This month",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: t('workerDashboard.pendingAmount') || "Pending Amount",
      value: stats.pendingAmount || "₹0",
      description: "Due by end of month",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: t('workerDashboard.attendance') || "Attendance",
      value: (stats.attendanceSummary?.present || "0") + " Days",
      description: `Absent: ${stats.attendanceSummary?.absent || 0} | Leave: ${stats.attendanceSummary?.onLeave || 0}`,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Assignments",
      value: "0",
      description: "Currently working on",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Profile Views",
      value: "0",
      description: "Last 30 days",
      gradient: "from-pink-500 to-pink-600",
    }
  ];

  return (
    <div className="relative group mb-6">
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-all focus:outline-none hidden md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={checkScroll}
        className={`flex overflow-x-auto gap-6 pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab'}`}
      >
        {cards.map((card, idx) => (
          <div key={idx} className="flex-none w-[85%] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] snap-start">
            <DashboardCard 
              title={card.title}
              count={card.value}
              colorClass={card.gradient}
              description={card.description}
            />
          </div>
        ))}
      </div>

      {showRightArrow && (
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-all focus:outline-none hidden md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
