import { Users, Building, Building2, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";

export default function DashboardStats({ data }) {
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
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px tolerance
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

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth * 0.75; // Scroll by 75% of container width
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const { t } = useTranslation();

  const stats = [
    { title: t("adminDashboard.totalUsers") || "Total Users", value: data?.totalUsers || "0", icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
    { title: t("adminDashboard.totalWorkers") || "Total Workers", value: data?.totalWorkers || "0", icon: CheckCircle, bgColor: "bg-green-50", iconColor: "text-green-500" },
    { title: t("adminDashboard.totalAgencies") || "Total Agencies", value: data?.totalAgencies || "0", icon: Building, bgColor: "bg-orange-50", iconColor: "text-orange-500" },
    { title: t("adminDashboard.totalClients") || "Total Clients", value: data?.totalClients || "0", icon: Building2, bgColor: "bg-purple-50", iconColor: "text-purple-500" },
    { title: t("adminDashboard.activeJobs") || "Active Jobs", value: data?.activeRequirements || "0", icon: CheckCircle, bgColor: "bg-green-50", iconColor: "text-green-500" },
    { title: t("adminDashboard.openJobs") || "Open Jobs", value: data?.openRequirements || "0", icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
  ];

  return (
    <div className="relative group mb-2">
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
        className={`flex overflow-x-auto gap-4 pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab'}`}
      >
        {stats.map((stat) => (
          <div key={stat.title} className="flex-none w-[85%] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(25%-0.75rem)] snap-start">
            <StatCard {...stat} />
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
