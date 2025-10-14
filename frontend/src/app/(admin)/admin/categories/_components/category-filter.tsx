"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import useDebounce from "@/hooks/use-debounce";

interface CategoryFiltersProps {
  search: string;
  setSearch: (value: string) => void;
}

export const CategoryFilters = ({
  search,
  setSearch,
}: CategoryFiltersProps) => {
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 500);

  // Update search query parameter when debounced search changes
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const handleClearFilters = () => {
    setSearchValue("");
    setSearch("");
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-9"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchValue("")}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
};