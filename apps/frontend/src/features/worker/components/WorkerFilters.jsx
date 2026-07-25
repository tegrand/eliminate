import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerFilterSchema } from "../schemas/workerFilter.schema";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function WorkerFilters() {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(workerFilterSchema),
    defaultValues: {
      status: "",
      agency: "",
      skill: "",
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
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>
          <div className="flex-1 w-full">
            <Select label="Agency" {...register("agency")}>
              <option value="">All Agencies</option>
              <option value="Alpha Staffing">Alpha Staffing</option>
              <option value="Beta Temp">Beta Temp</option>
            </Select>
          </div>
          <div className="flex-1 w-full">
            <Select label="Skill" {...register("skill")}>
              <option value="">All Skills</option>
              <option value="Forklift Operator">Forklift Operator</option>
              <option value="Warehouse Associate">Warehouse Associate</option>
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
