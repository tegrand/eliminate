import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobRequirementFilterSchema } from "../schemas/jobRequirementFilter.schema";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function JobRequirementFilters() {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(jobRequirementFilterSchema),
    defaultValues: {
      status: "",
      client: "",
      priority: "",
      dateRange: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Filter submitted:", data);
  };

  return (
    <Card className="mb-6 border-gray-200">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Select label="Status" {...register("status")}>
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
            <Select label="Client" {...register("client")}>
              <option value="">All Clients</option>
              <option value="techcorp">TechCorp Inc</option>
              <option value="globallogistics">Global Logistics</option>
            </Select>
            <Select label="Priority" {...register("priority")}>
              <option value="">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="CRITICAL">Critical</option>
            </Select>
            <Select label="Date Range" {...register("dateRange")}>
              <option value="">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="nextMonth">Next Month</option>
            </Select>
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Button type="button" variant="outline" onClick={() => reset()} className="w-full sm:w-auto">
              Reset
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Apply
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
