import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default function WorkerSkillCard({ worker }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">
          Skills & Qualifications
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500 block mb-2">Primary Skill</span>
            <Badge variant="primary">{worker.primarySkill}</Badge>
          </div>
          {worker.secondarySkill && (
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-2">Secondary Skill</span>
              <Badge variant="default">{worker.secondarySkill}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
