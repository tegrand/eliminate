import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X, LayoutGrid, Plus, Edit2, Trash2, Loader2, Save } from "lucide-react";
import api from "../../../api/axios";

export default function ClientCategoryManagerModal({ isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true
    }
  });

  const watchName = watch("name");

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const value = e.target.value;
    setValue("name", value);
    if (!isEditing) {
      setValue("slug", value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories", { params: { limit: 100 } })).data,
    enabled: isOpen
  });

  const categories = Array.isArray(data?.data?.items) ? data.data.items : (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/categories", data),
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries(["categories"]);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/categories/${id}`, data),
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries(["categories"]);
      setIsEditing(null);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  });

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate({ id: isEditing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (cat) => {
    setIsEditing(cat);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      isActive: cat.isActive !== false
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    reset({ name: "", slug: "", description: "", isActive: true });
  };

  if (!isOpen) return null;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Manage Categories</h2>
              <p className="text-xs text-gray-500">Add, edit, or remove job categories.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide flex flex-col gap-8">
          
          {/* Form */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              {isEditing ? <Edit2 className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-green-500" />}
              {isEditing ? "Edit Category" : "Add New Category"}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                <input 
                  type="text" 
                  {...register("name", { required: "Name is required" })}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Construction"
                />
                {errors.name && <span className="text-red-500 text-[10px] mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Slug *</label>
                <input 
                  type="text" 
                  {...register("slug", { 
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: "Only lowercase letters, numbers, and hyphens"
                    }
                  })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-gray-100"
                  placeholder="e.g. construction"
                />
                {errors.slug && <span className="text-red-500 text-[10px] mt-1 block">{errors.slug.message}</span>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  {...register("description")}
                  rows="2"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none"
                  placeholder="Optional description..."
                ></textarea>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                {isEditing && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm shadow-indigo-200"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isEditing ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Existing Categories</h3>
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : categories.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm border border-dashed rounded-xl border-gray-200">No categories found. Add one above!</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map(cat => (
                  <div key={cat.id} className={`p-4 rounded-xl border transition-all flex items-center justify-between ${isEditing?.id === cat.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{cat.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this category?")) {
                            deleteMutation.mutate(cat.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
