import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateFilterState } from '../components/GlobalDateFilter/types';

const initialState: DateFilterState = {
  startDate: null,
  endDate: null,
};

const dateFilterSlice = createSlice({
  name: 'dateFilter',
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<{ startDate: string | null; endDate: string | null }>
    ) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    clearDateRange: (state) => {
      state.startDate = null;
      state.endDate = null;
    },
  },
});

export const { setDateRange, clearDateRange } = dateFilterSlice.actions;
export default dateFilterSlice.reducer;