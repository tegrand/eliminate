import { Card, CardContent } from "../../../components/ui/card";
import { Wrench } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";

const MOCK_SKILLS = [
  { id: "SK-01", label: "Electrical" },
  { id: "SK-02", label: "Plumbing" },
  { id: "SK-03", label: "Forklift Operation" },
  { id: "SK-04", label: "Carpentry" },
];

export default function SkillsSection({ register }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-500" />
          Required Skills
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {MOCK_SKILLS.map((skill) => (
            <Checkbox 
              key={skill.id}
              label={skill.label}
              value={skill.id}
              {...register("skills")}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
