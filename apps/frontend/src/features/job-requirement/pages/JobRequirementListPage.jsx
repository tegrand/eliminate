import { useState } from "react";
import { toast } from "sonner";
import JobRequirementToolbar from "../components/JobRequirementToolbar";
import JobRequirementFilters from "../components/JobRequirementFilters";
import JobRequirementTable from "../components/JobRequirementTable";
import JobRequirementForm from "../components/JobRequirementForm";
import { Modal } from "../../../components/ui/modal";
import { useJobRequirements } from "../hooks/useJobRequirements";
import { jobRequirementApi } from "../api/jobRequirement.api";
import CategoriesPage from "../../categories/pages/CategoriesPage";
import LocationsPage from "../../locations/pages/LocationsPage";

export default function JobRequirementListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useJobRequirements({ page });
  
  const [showForm, setShowForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const handleCreate = () => {
    setEditingRow(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setShowForm(true);
  };

  const handleDuplicate = async (row) => {
    try {
      await jobRequirementApi.duplicateJobRequirement(row.id);
      toast.success("Job Requirement duplicated successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to duplicate");
    }
  };

  const handleCancel = async (row) => {
    const reason = window.prompt("Please enter a cancellation reason:");
    if (!reason) return;
    try {
      await jobRequirementApi.cancelJobRequirement(row.id, reason);
      toast.success("Job Requirement cancelled successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    }
  };

  const handleClose = async (row) => {
    if (!window.confirm("Are you sure you want to close this requirement?")) return;
    try {
      await jobRequirementApi.closeJobRequirement(row.id);
      toast.success("Job Requirement closed successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close");
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      const payload = {
        title: data.title,
        categoryId: (data.categoryId && data.categoryId.trim() !== "") ? data.categoryId : null,
        requiredWorkers: Number(data.requiredWorkers) || 1,
        genderPreference: data.genderPreference,
        experienceRequired: data.experienceRequired,
        locationId: (data.locationId && data.locationId.trim() !== "") ? data.locationId : null,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        shift: data.shift,
        duration: data.duration,
        salaryAmount: data.salaryAmount ? Number(data.salaryAmount) : undefined,
        notes: data.notes,
      };

      if (editingRow?.id) {
        await jobRequirementApi.updateJobRequirement(editingRow.id, payload);
        toast.success("Requirement updated successfully");
      } else {
        await jobRequirementApi.createJobRequirement(payload);
        toast.success("Requirement created successfully");
      }
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save requirement");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <JobRequirementToolbar totalRequirements={data?.data?.total} />
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            Manage Categories
          </button>
          <button 
            onClick={() => setShowLocationModal(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            Manage Locations
          </button>
          <button 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            + Create Requirement
          </button>
        </div>
      </div>
      <JobRequirementFilters />
      <JobRequirementTable 
        requirements={data?.data?.data || []} 
        loading={isLoading} 
        page={data?.data?.page || 1}
        totalPages={data?.data?.totalPages || 1}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onCancel={handleCancel}
        onClose={handleClose}
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingRow ? "Edit Requirement" : "Create Requirement"}
        className="max-w-4xl w-full sm:max-w-5xl"
      >
        <JobRequirementForm 
          mode={editingRow ? "edit" : "create"} 
          initialValues={editingRow} 
          onSubmit={handleSubmitForm}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Manage Categories"
        className="max-w-6xl w-full"
      >
        <div className="h-[70vh] overflow-y-auto">
          <CategoriesPage />
        </div>
      </Modal>

      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Manage Locations"
        className="max-w-6xl w-full"
      >
        <div className="h-[70vh] overflow-y-auto">
          <LocationsPage />
        </div>
      </Modal>
    </div>
  );
}
