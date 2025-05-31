import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Filters,
  SortByFilter,
  SortDirectionFilter,
  Subscription,
} from "../../utils/types";

interface ItemState {
  items: Subscription[];
  filters: Filters;
  editingItem: Subscription | null;
}
const initialState: ItemState = {
  items: [],
  filters: {
    sortBy: "none",
    sortDirection: "desc",
    dateRange: "all-subscriptions",
    priceRangeMax: null,
    priceRangeMin: null,
    q: null,
  },
  editingItem: null,
};

export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    updateItems: (
      state,
      action: PayloadAction<Subscription[] | Subscription>
    ) => {
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
      } else {
        const items = state.items;
        const index = items.findIndex(
          (v) => v.id === (action.payload as Subscription).id
        );

        if (index) {
          items[index] = action.payload;
        } else {
          items.push(action.payload);
        }

        state.items = items;
      }
    },
    updateSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.q = action.payload;
    },
    updateDateFilter: (
      state,
      action: PayloadAction<"7-days" | "30-days" | "all-subscriptions">
    ) => {
      state.filters.dateRange = action.payload;
    },
    updateMinPriceFilter: (state, action: PayloadAction<string>) => {
      state.filters.priceRangeMin = action.payload;
    },
    updateMaxPriceFilter: (state, action: PayloadAction<string>) => {
      state.filters.priceRangeMax = action.payload;
    },
    updateSortByFilter: (state, action: PayloadAction<SortByFilter>) => {
      state.filters.sortBy = action.payload;
    },
    updateSortDirectionFilter: (
      state,
      action: PayloadAction<SortDirectionFilter>
    ) => {
      state.filters.sortDirection = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateEditingItem: (state, action: PayloadAction<Subscription | null>) => {
      state.editingItem = action.payload;
    },
  },
});

export const {
  updateItems,
  updateEditingItem,
  updateDateFilter,
  updateSearchFilter,
  updateMaxPriceFilter,
  updateMinPriceFilter,
  updateSortByFilter,
  updateSortDirectionFilter,
  resetFilters,
} = itemSlice.actions;
export default itemSlice.reducer;
