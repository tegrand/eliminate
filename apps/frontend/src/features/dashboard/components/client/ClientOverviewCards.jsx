import {
  FileText,
  FolderOpen,
  Users,
  Briefcase,
  CheckCircle2,
  IndianRupee,
  CalendarClock,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../routes/routePaths";
import DashboardCard from "../DashboardCard";
import { useRef, useState, useEffect } from "react";

const cards = (stats, t) => [
  {
    label: t('clientDashboard.activeJobs') || "Active Jobs",
    value: stats?.activeJobs || 0,
    sub: t('clientDashboard.activeJobsSub') || "Currently open",
    gradient: "from-blue-500 to-blue-600",
    link: ROUTES.CLIENT_JOBS,
  },
  {
    label: t('clientDashboard.pendingRequests') || "Pending Requests",
    value: stats?.pendingRequests || 0,
    sub: t('clientDashboard.pendingRequestsSub') || "Awaiting action",
    gradient: "from-orange-500 to-orange-600",
    link: ROUTES.CLIENT_REQUESTS,
  },
  {
    label: t('clientDashboard.completedJobs') || "Completed Jobs",
    value: stats?.completedJobs || 0,
    sub: t('clientDashboard.completedJobsSub') || "Total completed",
    gradient: "from-teal-500 to-teal-600",
    link: ROUTES.CLIENT_JOBS,
  },
  {
    label: t('clientDashboard.assignedWorkers') || "Assigned Workers",
    value: stats?.assignedWorkers || 0,
    sub: t('clientDashboard.assignedWorkersSub') || "Currently working",
    gradient: "from-emerald-500 to-emerald-600",
    link: "#",
  },
  {
    label: "Total Spend",
    value: "₹0",
    sub: "This month",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    label: "Fav Agencies",
    value: "0",
    sub: "Saved agencies",
    gradient: "from-purple-500 to-purple-600",
  }
];

export default function ClientOverviewCards({ stats }) {
  const { t } = useTranslation();
  const items = cards(stats, t);

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

  return (
    <div>
      <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="inline-block w-4 h-px bg-gray-300" />
        {t('clientDashboard.overview') || "Overview"}
        <span className="inline-block flex-1 h-px bg-gray-100" />
      </h2>

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
          {items.map((card, idx) => (
            <div key={card.label} className="flex-none w-[85%] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] snap-start">
              <DashboardCard
                title={card.label}
                count={card.value}
                colorClass={card.gradient}
                link={card.link}
                description={card.sub}
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
    </div>
  );
}
