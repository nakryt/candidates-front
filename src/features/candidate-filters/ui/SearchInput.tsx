import type { ChangeEvent, FC } from "react";
import { Input } from "../../../shared/ui/Input";
import { Search } from "../../../shared/ui/icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = (props) => {
  const { value, onChange } = props;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search by name..."
        value={value}
        onChange={handleChange}
        className="pl-10"
        aria-label="Search candidates by name"
      />
    </div>
  );
};
