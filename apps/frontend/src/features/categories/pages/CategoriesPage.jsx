import { useState } from "react";
import { toast } from "sonner";
import { useCategories } from "../hooks/useCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import CategoryToolbar from "../components/CategoryToolbar";
import CategoryTable from "../components/CategoryTable";
import CategoryForm from "../components/CategoryForm";
import { Modal } from "../../../components/ui/modal";

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

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
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteMut.mutateAsync(id);
      toast.success("Category deleted successfully");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      
      if (editingData) {
        await updateMut.mutateAsync({ id: editingData.id, data: payload });
        toast.success("Category updated successfully");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to save category");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <CategoryToolbar total={data?.data?.pagination?.total} onAdd={handleOpenAdd} />
      <CategoryTable 
        data={data?.data?.items} 
        loading={isLoading} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? "Edit Category" : "Add New Category"}
      >
        <CategoryForm 
          initialValues={editingData} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)}
          loading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  );
}
