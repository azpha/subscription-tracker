import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updateDateFilter,
  updateSearchFilter,
} from "../store/reducers/itemSlice";
import { DateRangeFilter } from "../utils/types";
import { hydrateItems } from "../store/thunks/itemThunks";
import StyledInput from "./StyledInput";

export default function SubscriptionFilters() {
  // hooks
  const dispatch = useAppDispatch();

  // state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const filters = useAppSelector((state) => state.item.filters);

  useEffect(() => {
    const params = [];

    if (filters.dateRange && filters.dateRange !== "all-subscriptions") {
      params.push(`dateRange=${filters.dateRange}`);
    }
    if (filters.q) {
      params.push(`q=${filters.q}`);
    }

    dispatch(hydrateItems(params.join("&")));
  }, [filters]);

  const Filters = () => {
    return (
      <div>
        <hr className="my-4" />
        <div className="pb-2">
          <label className="font-semibold">Renewal Period</label>
        </div>
        <div>
          <select
            onChange={(e) =>
              dispatch(updateDateFilter(e.target.value as DateRangeFilter))
            }
            className="bg-white w-full p-2 text-black"
            id="renewal"
            value={filters.dateRange}
          >
            <option value={"all-subscriptions"}>All subscriptions</option>
            <option value={"7-days"}>7 days</option>
            <option value={"30-days"}>30 days</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-white border-solid p-4 w-full">
      <div className="flex flex-wrap space-x-2">
        <div className="relative flex-1">
          <StyledInput
            type={"text"}
            dark={false}
            placeholder={"search.."}
            shouldDebounce={true}
            onChange={(v: string) => {
              dispatch(updateSearchFilter(v));
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white text-black rounded-lg p-2 font-bold hover:cursor-pointer"
        >
          Filters
        </button>
      </div>

      {showFilters && <Filters />}
    </div>
  );
}
