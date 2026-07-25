import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agencyFilterSchema } from "../schemas/agencyFilter.schema";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function AgencyFilters() {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(agencyFilterSchema),
    defaultValues: {
      status: "",
      district: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Filter submitted:", data);
  };

  return (
    <Card className="mb-6 border-gray-200">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <Select label="Status" {...register("status")}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </Select>
          </div>
          <div className="flex-1 w-full">
            <Select label="District" {...register("district")}>
              <option value="">All Districts</option>
              <option value="North District">North District</option>
              <option value="South District">South District</option>
              <option value="Central">Central</option>
            </Select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
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
