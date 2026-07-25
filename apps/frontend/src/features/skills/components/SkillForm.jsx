import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema } from "../schemas/skill.schema";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

export default function SkillForm({ initialValues, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: initialValues || {
      code: "",
      name: "",
      category: "",
      description: "",
      status: "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Skill Code" error={errors.code?.message} {...register("code")} />
      <Input label="Skill Name" error={errors.name?.message} {...register("name")} />
      <Input label="Category" error={errors.category?.message} {...register("category")} />
      <Input label="Description" error={errors.description?.message} {...register("description")} />
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
