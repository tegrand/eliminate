import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { workerSchema } from "../schemas/worker.schema";

import PersonalInformationSection from "./PersonalInformationSection";
import ContactInformationSection from "./ContactInformationSection";
import EmploymentInformationSection from "./EmploymentInformationSection";
import SkillsSection from "./SkillsSection";
import EmergencyContactSection from "./EmergencyContactSection";
import WorkerFormActions from "./WorkerFormActions";

export default function WorkerForm({ mode = "create", initialValues, onSubmit, isLoading }) {
  const navigate = useNavigate();

  const defaultValues = {
    employeeId: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    alternatePhone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    agency: "",
    primarySkill: "",
    secondarySkill: "",
    joiningDate: "",
    status: "",
    salary: "",
    emergencyContactName: "",
    emergencyRelationship: "",
    emergencyContactNumber: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workerSchema),
    values: initialValues || defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <PersonalInformationSection register={register} errors={errors} />
      <ContactInformationSection register={register} errors={errors} />
      <EmploymentInformationSection register={register} errors={errors} />
      <SkillsSection register={register} errors={errors} />
      <EmergencyContactSection register={register} errors={errors} />
      
      <WorkerFormActions 
        mode={mode}
        loading={isLoading} 
        onCancel={() => navigate("/workers")} 
      />
    </form>
  );
}
