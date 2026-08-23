import { useState } from "react";
import { toast } from "sonner";
import { useLanguages } from "../hooks/useLanguages";
import { useCreateLanguage } from "../hooks/useCreateLanguage";
import { useUpdateLanguage } from "../hooks/useUpdateLanguage";
import { useDeleteLanguage } from "../hooks/useDeleteLanguage";
import LanguageToolbar from "../components/LanguageToolbar";
import LanguageTable from "../components/LanguageTable";
import LanguageForm from "../components/LanguageForm";
import { Modal } from "../../../components/ui/modal";

export default function LanguagesPage() {
  const { data, isLoading } = useLanguages();
  const createMut = useCreateLanguage();
  const updateMut = useUpdateLanguage();
  const deleteMut = useDeleteLanguage();

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
    if (window.confirm("Are you sure you want to delete this language?")) {
      await deleteMut.mutateAsync(id);
      toast.success("Language deleted successfully");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingData) {
        await updateMut.mutateAsync({ id: editingData.id, data: formData });
        toast.success("Language updated successfully");
      } else {
        await createMut.mutateAsync(formData);
        toast.success("Language created successfully");
      }
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to save language");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <LanguageToolbar total={data?.data?.total} onAdd={handleOpenAdd} />
      <LanguageTable 
        data={data?.data?.languages} 
        loading={isLoading} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? "Edit Language" : "Add New Language"}
      >
        <LanguageForm 
          initialValues={editingData} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)}
          loading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  );
}
