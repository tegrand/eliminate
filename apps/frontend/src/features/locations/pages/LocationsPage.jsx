import { useState } from "react";
import { toast } from "sonner";
import { useLocations } from "../hooks/useLocations";
import { useCreateLocation } from "../hooks/useCreateLocation";
import { useUpdateLocation } from "../hooks/useUpdateLocation";
import { useDeleteLocation } from "../hooks/useDeleteLocation";
import LocationToolbar from "../components/LocationToolbar";
import LocationTable from "../components/LocationTable";
import LocationForm from "../components/LocationForm";
import { Modal } from "../../../components/ui/modal";

export default function LocationsPage() {
  const { data, isLoading } = useLocations();
  const createMut = useCreateLocation();
  const updateMut = useUpdateLocation();
  const deleteMut = useDeleteLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleOpenAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingData(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await deleteMut.mutateAsync(id);
      toast.success("Location deleted successfully");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        code: formData.name.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 20)
      };
      
      if (editingData) {
        await updateMut.mutateAsync({ id: editingData.id, data: payload });
        toast.success("Location updated successfully");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Location created successfully");
      }
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to save location");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <LocationToolbar total={data?.data?.pagination?.total} onAdd={handleOpenAdd} />
      <LocationTable 
        data={data?.data?.items} 
        loading={isLoading} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? "Edit Location" : "Add New Location"}
      >
        <LocationForm 
          initialValues={editingData} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  );
}
