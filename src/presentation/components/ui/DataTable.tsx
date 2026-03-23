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
    return <p className="text-center text-slate-400 py-12 text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              {columns.map(col => (
                <th key={col.key} className={`text-left py-3.5 px-5 font-bold text-slate-600 text-xs uppercase tracking-wider ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(item => (
              <tr
                key={keyExtractor(item)}
                className={`transition-colors ${onRowClick ? 'hover:bg-blue-50 cursor-pointer' : 'hover:bg-slate-50'}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map(col => (
                  <td key={col.key} className={`py-3.5 px-5 text-slate-700 ${col.className ?? ''}`}>
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
