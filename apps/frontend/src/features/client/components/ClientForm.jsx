import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { clientSchema } from "../schemas/client.schema";

import CompanyInformationSection from "./CompanyInformationSection";
import ContactInformationSection from "./ContactInformationSection";
import BillingInformationSection from "./BillingInformationSection";
import NotesSection from "./NotesSection";
import ClientFormActions from "./ClientFormActions";

export default function ClientForm({ mode = "create", initialValues, onSubmit, isLoading }) {
  const navigate = useNavigate();

  const defaultValues = {
    companyName: "",
    industry: "",
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
    billingCycle: "",
    paymentTerms: "",
    billingAddress: "",
    status: "",
    notes: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    values: initialValues || defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <CompanyInformationSection register={register} errors={errors} />
      <ContactInformationSection register={register} errors={errors} />
      <BillingInformationSection register={register} errors={errors} />
      <NotesSection register={register} errors={errors} />
      
      <ClientFormActions 
        mode={mode}
        loading={isLoading} 
        onCancel={() => navigate("/clients")} 
      />
    </form>
  );
}
