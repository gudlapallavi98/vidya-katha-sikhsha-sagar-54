
import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: FormEvent) => void;
}

const CourseSearch = ({ searchQuery, setSearchQuery, onSearch }: CourseSearchProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Trigger search on type for better UX
    const event = new Event('submit') as unknown as FormEvent;
    onSearch(event);
  };

  return (
    <div>
      <h3 className="font-medium mb-4">Search Courses</h3>
      <form onSubmit={onSearch} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-9"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" size="sm">Search</Button>
        </div>
      </form>
    </div>
  );
};

export default CourseSearch;
