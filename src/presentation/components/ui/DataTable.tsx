interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = 'No hay datos' }: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="text-center text-neutral-400 py-12 text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50/80">
              {columns.map(col => (
                <th key={col.key} className={`text-left py-3 px-5 font-semibold text-neutral-500 text-xs uppercase tracking-wider ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.map(item => (
              <tr
                key={keyExtractor(item)}
                className={`transition-colors ${onRowClick ? 'hover:bg-primary/[0.03] cursor-pointer' : 'hover:bg-neutral-50/50'}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map(col => (
                  <td key={col.key} className={`py-3.5 px-5 text-neutral-700 ${col.className ?? ''}`}>
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
