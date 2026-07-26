import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { Wrench } from "lucide-react";

export default function SkillsSection({ register, errors }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-500" />
          Skills
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select 
            label="Primary Skill" 
            error={errors.primarySkill?.message}
            {...register("primarySkill")}
          >
            <option value="">Select Primary Skill</option>
            <option value="Forklift Operator">Forklift Operator</option>
            <option value="Warehouse Associate">Warehouse Associate</option>
          </Select>
          
          <Select 
            label="Secondary Skill" 
            error={errors.secondarySkill?.message}
            {...register("secondarySkill")}
          >
            <option value="">Select Secondary Skill</option>
            <option value="Forklift Operator">Forklift Operator</option>
            <option value="Warehouse Associate">Warehouse Associate</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
