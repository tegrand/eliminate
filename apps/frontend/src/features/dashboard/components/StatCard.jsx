import { Card, CardContent } from "../../../components/ui/card";

export default function StatCard({ icon: Icon, title, value, trend, trendUp }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={trendUp ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {trend}
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
