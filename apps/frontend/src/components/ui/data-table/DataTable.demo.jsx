import { useState } from "react";
import { 
  DataTable, 
  DataTableToolbar, 
  DataTablePagination 
} from "./index";
import { Badge } from "../badge";
import { Button } from "../button";
import { Input } from "../input";

const MOCK_DATA = [
  { id: "1", name: "Alice Johnson", role: "Administrator", status: "active", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", role: "Worker", status: "inactive", email: "bob@example.com" },
  { id: "3", name: "Charlie Davis", role: "Client", status: "active", email: "charlie@example.com" },
  { id: "4", name: "Diana Prince", role: "Agency", status: "pending", email: "diana@example.com" },
];

export default function DataTableDemo() {

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      key: "role",
      title: "Role",
      render: (row) => row.role
    },
    {
      key: "status",
      title: "Status",
      render: (row) => {
        const variants = {
          active: "success",
          inactive: "danger",
          pending: "warning"
        };
        return (
          <Badge variant={variants[row.status]} size="sm">
            {row.status}
          </Badge>
        );
      }
    },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <Button variant="ghost" size="sm">Edit</Button>
      )
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">DataTable Component Demo</h1>

      {/* Complex Table Setup */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Full Table Implementation</h2>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <DataTableToolbar>
            <Input 
              placeholder="Search users..." 
              className="max-w-xs" 
            />
            <div className="flex gap-2">
              <Button variant="outline">Filter</Button>
              <Button>Add User</Button>
            </div>
          </DataTableToolbar>

          <DataTable 
            columns={columns} 
            data={MOCK_DATA} 
            rowKey="id"
            striped
          />

          <DataTablePagination>
            <p className="text-sm text-gray-500">Showing 1 to 4 of 4 entries</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </DataTablePagination>
        </div>
      </section>

      {/* States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Loading State */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Loading State</h2>
          <DataTable 
            columns={columns} 
            data={[]} 
            loading={true}
          />
        </section>

        {/* Empty State */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Empty State</h2>
          <DataTable 
            columns={columns} 
            data={[]} 
          />
        </section>

        {/* Compact & Bordered */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Compact & Bordered</h2>
          <DataTable 
            columns={columns} 
            data={MOCK_DATA} 
            compact
            bordered
          />
        </section>

        {/* Striped without Hover */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Striped (No Hover)</h2>
          <DataTable 
            columns={columns} 
            data={MOCK_DATA} 
            striped
            hover={false}
          />
        </section>

      </div>
    </div>
  );
}
