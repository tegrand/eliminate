import { useState } from "react";
import { toast } from "sonner";
import { useSkills } from "../hooks/useSkills";
import { useCreateSkill } from "../hooks/useCreateSkill";
import { useUpdateSkill } from "../hooks/useUpdateSkill";
import { useDeleteSkill } from "../hooks/useDeleteSkill";
import SkillToolbar from "../components/SkillToolbar";
import SkillTable from "../components/SkillTable";
import SkillForm from "../components/SkillForm";
import { Modal } from "../../../components/ui/modal";

export default function SkillsPage() {
  const { data, isLoading } = useSkills();
  const createMut = useCreateSkill();
  const updateMut = useUpdateSkill();
  const deleteMut = useDeleteSkill();

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
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await deleteMut.mutateAsync(id);
      toast.success("Skill deleted successfully");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingData) {
        await updateMut.mutateAsync({ id: editingData.id, data: formData });
        toast.success("Skill updated successfully");
      } else {
        await createMut.mutateAsync(formData);
        toast.success("Skill created successfully");
      }
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to save skill");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <SkillToolbar total={data?.data?.total} onAdd={handleOpenAdd} />
      <SkillTable 
        data={data?.data?.skills} 
        loading={isLoading} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? "Edit Skill" : "Add New Skill"}
      >
        <SkillForm 
          initialValues={editingData} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  );
}
