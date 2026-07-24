import { Users, Building2, Search, ShieldAlert } from "lucide-react";
import { EmptyState } from "./index";
import { Button } from "../button";

export default function EmptyStateDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Empty State Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">No Workers</h2>
        <EmptyState 
          icon={<Users className="h-8 w-8" />}
          title="No workers found"
          description="Get started by creating a new worker profile. They will appear here once added to the system."
          action={<Button>Add Worker</Button>}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">No Clients</h2>
        <EmptyState 
          icon={<Building2 className="h-8 w-8" />}
          title="No clients available"
          description="You haven't onboarded any clients yet. Create your first client to start assigning projects."
          action={<Button>Create Client</Button>}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Search Empty</h2>
        <EmptyState 
          icon={<Search className="h-8 w-8" />}
          title="No results found"
          description="We couldn't find anything matching your search criteria. Try adjusting your filters or search term."
          action={<Button variant="outline">Clear Filters</Button>}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Permission Empty</h2>
        <EmptyState 
          icon={<ShieldAlert className="h-8 w-8 text-red-500" />}
          title="Access Denied"
          description="You do not have the necessary permissions to view this module. Please contact your administrator."
          action={<Button variant="secondary">Return to Dashboard</Button>}
          className="border-red-200 bg-red-50"
        />
      </section>
    </div>
  );
}
