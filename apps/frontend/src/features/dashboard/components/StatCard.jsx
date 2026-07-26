import { Card, CardContent } from "../../../components/ui/card";

export default function StatCard({ icon: Icon, title, value, bgColor, iconColor }) {
  return (
    <Card className="hover:shadow-md transition-shadow border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor}`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <p className="text-xs font-semibold text-gray-600 whitespace-nowrap">{title}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
