import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full max-w-md rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
      />
    </div>
  );
}
