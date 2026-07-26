import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { jobRequirementSchema } from "../schemas/jobRequirement.schema";

import GeneralInformationSection from "./GeneralInformationSection";
import ClientInformationSection from "./ClientInformationSection";
import RequirementDetailsSection from "./RequirementDetailsSection";
import SkillsSection from "./SkillsSection";
import ScheduleSection from "./ScheduleSection";
import NotesSection from "./NotesSection";
import JobRequirementFormActions from "./JobRequirementFormActions";

export default function JobRequirementForm({ mode = "create", initialValues, onSubmit, isLoading }) {
  const navigate = useNavigate();

  const defaultValues = {
    jobTitle: "",
    priority: "",
    status: "OPEN",
    clientId: "",
    contactPersonId: "",
    requiredWorkers: 1,
    jobDescription: "",
    skills: [],
    startDate: "",
    endDate: "",
    workingHours: "",
    notes: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobRequirementSchema),
    values: initialValues || defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <GeneralInformationSection register={register} errors={errors} />
      <ClientInformationSection register={register} errors={errors} />
      <RequirementDetailsSection register={register} errors={errors} />
      <SkillsSection register={register} />
      <ScheduleSection register={register} errors={errors} />
      <NotesSection register={register} errors={errors} />
      
      <JobRequirementFormActions 
        mode={mode}
        loading={isLoading} 
        onCancel={() => navigate("/job-requirements")} 
      />
    </form>
  );
}
