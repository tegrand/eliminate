import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { agencySchema } from "../schemas/agency.schema";

import BasicInformationSection from "./BasicInformationSection";
import ContactInformationSection from "./ContactInformationSection";
import AddressSection from "./AddressSection";
import BankingInformationSection from "./BankingInformationSection";
import AgencyFormActions from "./AgencyFormActions";

export default function AgencyForm({ mode = "create", initialValues, onSubmit, isLoading }) {
  const navigate = useNavigate();

  const defaultValues = {
    agencyName: "",
    registrationNumber: "",
    taxId: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    status: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agencySchema),
    values: initialValues || defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <BasicInformationSection register={register} errors={errors} />
      <ContactInformationSection register={register} errors={errors} />
      <AddressSection register={register} errors={errors} />
      <BankingInformationSection register={register} errors={errors} />
      
      <AgencyFormActions 
        mode={mode}
        loading={isLoading} 
        onCancel={() => navigate("/agencies")} 
      />
    </form>
  );
}
