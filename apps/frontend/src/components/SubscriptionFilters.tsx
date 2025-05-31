import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  resetFilters,
  updateDateFilter,
  updateMaxPriceFilter,
  updateMinPriceFilter,
  updateSearchFilter,
  updateSortByFilter,
  updateSortDirectionFilter,
} from "../store/reducers/itemSlice";
import {
  DateRangeFilter,
  SortByFilter,
  SortDirectionFilter,
} from "../utils/types";

import StyledInput from "./StyledInput";
import { Filter, SortAsc } from "lucide-react";

export default function SubscriptionFilters() {
  // hooks
  const dispatch = useAppDispatch();

  // state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);

  const Filters = () => {
    return (
      <div>
        <hr className="my-4" />
        <div className="space-y-2">
          <div>
            <div className="pb-2">
              <label className="font-semibold">Minimum Price</label>
            </div>
            <div>
              <StyledInput
                type={"text"}
                placeholder="Min. Price.."
                dark={false}
                shouldDebounce={true}
                onChange={(v: string) => {
                  dispatch(updateMinPriceFilter(v));
                }}
              />
            </div>
          </div>

          <div>
            <div className="pb-2">
              <label className="font-semibold">Maximum Price</label>
            </div>
            <div>
              <StyledInput
                type={"text"}
                placeholder="Max. Price.."
                dark={false}
                shouldDebounce={true}
                onChange={(v: string) => {
                  dispatch(updateMaxPriceFilter(v));
                }}
              />
            </div>
          </div>

          <div>
            <div className="pb-2">
              <label className="font-semibold">Renewal Period</label>
            </div>
            <div>
              <select
                onChange={(e) =>
                  dispatch(updateDateFilter(e.target.value as DateRangeFilter))
                }
                className="bg-white w-full p-2 text-black rounded-lg"
                id="renewal"
              >
                <option value={"all-subscriptions"}>All subscriptions</option>
                <option value={"7-days"}>7 days</option>
                <option value={"30-days"}>30 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Sort = () => {
    return (
      <div>
        <hr className="my-4" />
        <div className="space-y-2">
          <div>
            <div className="pb-2">
              <label className="font-semibold">Sort By</label>
            </div>
            <div>
              <select
                onChange={(e) =>
                  dispatch(updateSortByFilter(e.target.value as SortByFilter))
                }
                className="bg-white w-full p-2 text-black rounded-lg"
                id="renewal"
              >
                <option value={"none"}>None</option>
                <option value={"price"}>Price</option>
                <option value={"date"}>Date</option>
              </select>
            </div>
          </div>

          <div>
            <div className="pb-2">
              <label className="font-semibold">Sort Direction</label>
            </div>
            <div>
              <select
                onChange={(e) =>
                  dispatch(
                    updateSortDirectionFilter(
                      e.target.value as SortDirectionFilter
                    )
                  )
                }
                className="bg-white w-full p-2 text-black rounded-lg"
                id="renewal"
              >
                <option value={"desc"}>Descending</option>
                <option value={"asc"}>Ascending</option>
              </select>
            </div>
          </div>
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
          onClick={() => {
            setShowFilters(false);
            setShowSort(!showSort);
            dispatch(resetFilters());
          }}
          className="bg-white text-black rounded-lg p-2 font-bold hover:cursor-pointer"
        >
          <SortAsc />
        </button>
        <button
          onClick={() => {
            setShowSort(false);
            setShowFilters(!showFilters);
            dispatch(resetFilters());
          }}
          className="bg-white text-black rounded-lg p-2 font-bold hover:cursor-pointer"
        >
          <Filter />
        </button>
      </div>

      {showFilters && <Filters />}
      {showSort && <Sort />}
    </div>
  );
}
