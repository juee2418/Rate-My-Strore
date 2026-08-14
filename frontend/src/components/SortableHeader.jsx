import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export default function SortableHeader({ label, field, sortBy, order, onSort }) {
  const isActive = sortBy === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-brand-700"
    >
      <span className="flex items-center gap-1">
        {label}
        {isActive ? (
          order === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />
        )}
      </span>
    </th>
  );
}
