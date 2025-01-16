// types.ts
export interface DateFilterState {
    startDate: string | null;
    endDate: string | null;
}

export interface DateFilterProps {
    onFilterChange?: (state: DateFilterState) => void;
    className?: string;
    theme?: 'black' | 'white';
}