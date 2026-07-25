import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema } from "../schemas/location.schema";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

export default function LocationForm({ initialValues, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: initialValues || {
      code: "",
      name: "",
      district: "",
      state: "",
      status: "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Location Code" error={errors.code?.message} {...register("code")} />
      <Input label="Location Name" error={errors.name?.message} {...register("name")} />
      <Input label="District" error={errors.district?.message} {...register("district")} />
      <Input label="State" error={errors.state?.message} {...register("state")} />
      <Select label="Status" error={errors.status?.message} {...register("status")}>
        <option value="">Select...</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </Select>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" loading={isLoading}>Save</Button>
      </div>
    </form>
  );
}
