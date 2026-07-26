import { Card, CardContent } from "../../../components/ui/card";

export default function WorkerInformationCard({ worker }) {
  const info = [
    { label: "Gender", value: worker.gender },
    { label: "Date of Birth", value: worker.dateOfBirth },
    { label: "Agency", value: worker.agency },
    { label: "Joining Date", value: worker.joiningDate },
    { label: "Address", value: worker.address },
    { label: "District", value: worker.district },
    { label: "PIN Code", value: worker.pinCode },
    { label: "Salary", value: worker.salary },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">
          General Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {info.map((item, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-1">{item.label}</span>
              <span className="text-sm text-gray-900">{item.value || "-"}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
