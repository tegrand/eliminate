import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modules = [
  {
    name: 'location',
    plural: 'locations',
    Title: 'Location',
    PluralTitle: 'Locations',
    fields: [
      { name: 'code', label: 'Location Code', required: true },
      { name: 'name', label: 'Location Name', required: true },
      { name: 'district', label: 'District', required: true },
      { name: 'state', label: 'State', required: true },
      { name: 'status', label: 'Status', required: true, isSelect: true, options: ['ACTIVE', 'INACTIVE'] }
    ]
  }
];

for (const mod of modules) {
  const dir = path.join(__dirname, 'src', 'features', mod.plural);
  const dirs = ['api', 'constants', 'components', 'hooks', 'pages', 'schemas'];
  dirs.forEach(d => fs.mkdirSync(path.join(dir, d), { recursive: true }));

  // 1. schema
  const schemaStr = `import { z } from "zod";

export const ${mod.name}Schema = z.object({
${mod.fields.map(f => `  ${f.name}: z.string()${f.required ? `.min(1, "${f.label} is required")` : `.optional()`},`).join('\n')}
});
`;
  fs.writeFileSync(path.join(dir, 'schemas', `${mod.name}.schema.js`), schemaStr);

  // 2. keys
  const keysStr = `export const ${mod.name}Keys = {
  all: ["${mod.plural}"],
  lists: () => [...${mod.name}Keys.all, "list"],
  list: (filters) => [...${mod.name}Keys.lists(), { filters }],
  details: () => [...${mod.name}Keys.all, "detail"],
  detail: (id) => [...${mod.name}Keys.details(), id],
};
`;
  fs.writeFileSync(path.join(dir, 'constants', `${mod.name}QueryKeys.js`), keysStr);

  // 3. api
  const apiStr = `export const ${mod.name}Api = {
  get${mod.PluralTitle}: async (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            ${mod.plural}: [
              { id: "1", ${mod.fields.map(f => `${f.name}: "${f.label} 1"`).join(', ')} },
              { id: "2", ${mod.fields.map(f => `${f.name}: "${f.label} 2"`).join(', ')} },
            ],
            total: 2,
            page: 1,
            totalPages: 1
          }
        });
      }, 500);
    });
  },
  create${mod.Title}: async (data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  update${mod.Title}: async (id, data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  delete${mod.Title}: async (id) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
};
`;
  fs.writeFileSync(path.join(dir, 'api', `${mod.name}.api.js`), apiStr);

  // 4. hooks
  const hooksStr1 = `import { useQuery } from "@tanstack/react-query";
import { ${mod.name}Api } from "../api/${mod.name}.api";
import { ${mod.name}Keys } from "../constants/${mod.name}QueryKeys";

export const use${mod.PluralTitle} = (params) => {
  return useQuery({
    queryKey: ${mod.name}Keys.list(params),
    queryFn: () => ${mod.name}Api.get${mod.PluralTitle}(params),
    placeholderData: (prev) => prev,
  });
};
`;
  fs.writeFileSync(path.join(dir, 'hooks', `use${mod.PluralTitle}.js`), hooksStr1);

  const hooksStr2 = `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ${mod.name}Api } from "../api/${mod.name}.api";
import { ${mod.name}Keys } from "../constants/${mod.name}QueryKeys";

export const useCreate${mod.Title} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ${mod.name}Api.create${mod.Title}(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ${mod.name}Keys.lists() }),
  });
};
`;
  fs.writeFileSync(path.join(dir, 'hooks', `useCreate${mod.Title}.js`), hooksStr2);

  const hooksStr3 = `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ${mod.name}Api } from "../api/${mod.name}.api";
import { ${mod.name}Keys } from "../constants/${mod.name}QueryKeys";

export const useUpdate${mod.Title} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => ${mod.name}Api.update${mod.Title}(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ${mod.name}Keys.lists() }),
  });
};
`;
  fs.writeFileSync(path.join(dir, 'hooks', `useUpdate${mod.Title}.js`), hooksStr3);

  const hooksStr4 = `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ${mod.name}Api } from "../api/${mod.name}.api";
import { ${mod.name}Keys } from "../constants/${mod.name}QueryKeys";

export const useDelete${mod.Title} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ${mod.name}Api.delete${mod.Title}(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ${mod.name}Keys.lists() }),
  });
};
`;
  fs.writeFileSync(path.join(dir, 'hooks', `useDelete${mod.Title}.js`), hooksStr4);

  // 5. Components
  const toolbarStr = `import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function ${mod.Title}Toolbar({ total, onAdd }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">${mod.PluralTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">{total !== undefined ? \`Total \${total} found\` : "Loading..."}</p>
      </div>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" /> Add ${mod.Title}
      </Button>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'components', `${mod.Title}Toolbar.jsx`), toolbarStr);

  const tableStr = `import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";

export default function ${mod.Title}Table({ data, loading, onEdit, onDelete }) {
  const columns = [
${mod.fields.map(f => `    { key: "${f.name}", title: "${f.label}", render: (row) => row.${f.name} },`).join('\n')}
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(row)} className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(row.id)} className="p-1 text-gray-400 hover:text-red-600 focus:outline-none">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable columns={columns} data={data || []} loading={loading} rowKey="id" hover />
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'components', `${mod.Title}Table.jsx`), tableStr);

  const formStr = `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ${mod.name}Schema } from "../schemas/${mod.name}.schema";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

export default function ${mod.Title}Form({ initialValues, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(${mod.name}Schema),
    defaultValues: initialValues || {
${mod.fields.map(f => `      ${f.name}: "",`).join('\n')}
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
${mod.fields.map(f => {
  if (f.isSelect) {
    return `      <Select label="${f.label}" error={errors.${f.name}?.message} {...register("${f.name}")}>
        <option value="">Select...</option>
${f.options.map(opt => `        <option value="${opt}">${opt}</option>`).join('\n')}
      </Select>`;
  }
  return `      <Input label="${f.label}" error={errors.${f.name}?.message} {...register("${f.name}")} />`;
}).join('\n')}
      
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" loading={isLoading}>Save</Button>
      </div>
    </form>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'components', `${mod.Title}Form.jsx`), formStr);

  // 6. Page
  const pageStr = `import { useState } from "react";
import { toast } from "sonner";
import { use${mod.PluralTitle} } from "../hooks/use${mod.PluralTitle}";
import { useCreate${mod.Title} } from "../hooks/useCreate${mod.Title}";
import { useUpdate${mod.Title} } from "../hooks/useUpdate${mod.Title}";
import { useDelete${mod.Title} } from "../hooks/useDelete${mod.Title}";
import ${mod.Title}Toolbar from "../components/${mod.Title}Toolbar";
import ${mod.Title}Table from "../components/${mod.Title}Table";
import ${mod.Title}Form from "../components/${mod.Title}Form";
import { Modal } from "../../../components/ui/modal";

export default function ${mod.PluralTitle}Page() {
  const { data, isLoading } = use${mod.PluralTitle}();
  const createMut = useCreate${mod.Title}();
  const updateMut = useUpdate${mod.Title}();
  const deleteMut = useDelete${mod.Title}();

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
    if (window.confirm("Are you sure you want to delete this ${mod.name}?")) {
      await deleteMut.mutateAsync(id);
      toast.success("${mod.Title} deleted successfully");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingData) {
        await updateMut.mutateAsync({ id: editingData.id, data: formData });
        toast.success("${mod.Title} updated successfully");
      } else {
        await createMut.mutateAsync(formData);
        toast.success("${mod.Title} created successfully");
      }
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to save ${mod.name}");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <${mod.Title}Toolbar total={data?.data?.total} onAdd={handleOpenAdd} />
      <${mod.Title}Table 
        data={data?.data?.${mod.plural}} 
        loading={isLoading} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? "Edit ${mod.Title}" : "Add New ${mod.Title}"}
      >
        <${mod.Title}Form 
          initialValues={editingData} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'pages', `${mod.PluralTitle}Page.jsx`), pageStr);
}

console.log('CRUD generated successfully.');
