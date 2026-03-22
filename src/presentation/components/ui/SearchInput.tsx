import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-3 text-sm outline-none hover:border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
      />
    </div>
  );
}
