
import { Search, Filter, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRIORITIES } from '../api/jobs.api';

interface JobFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  search, setSearch, priority, setPriority, sortBy, setSortBy
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Search by company or title..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:ring-1"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-slate-950 border-transparent">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            {PRIORITIES.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] bg-slate-50 dark:bg-slate-950 border-transparent">
            <SortDesc className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="appliedDate">Applied Date</SelectItem>
            <SelectItem value="nextFollowUpDate">Follow-up Date</SelectItem>
            <SelectItem value="companyName">Company Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
