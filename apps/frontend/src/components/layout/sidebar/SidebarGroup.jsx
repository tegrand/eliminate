import SidebarItem from "./SidebarItem";

export default function SidebarGroup({ group }) {
  return (
    <div className="py-2">
      {group.group && (
        <h3 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {group.group}
        </h3>
      )}
      <div className="space-y-1">
        {group.items.map((item, index) => (
          <SidebarItem key={item.path || index} item={item} />
        ))}
      </div>
    </div>
  );
}
