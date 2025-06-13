import { useState, useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  resetFilters,
  updateDateFilter,
  updateMaxPriceFilter,
  updateMinPriceFilter,
  updateSearchFilter,
  updateSortByFilter,
  updateSortDirectionFilter,
} from "@/store/reducers/itemSlice";
import {
  DateRangeFilter,
  SortByFilter,
  SortDirectionFilter,
} from "@/utils/types";
import { debounce } from "lodash";

import { Input } from "@/components/ui/input";
import { Filter, SortAsc } from "lucide-react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export default function SubscriptionFilters() {
  // state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);

  // hooks
  const dispatch = useAppDispatch();
  const debounced = useCallback(
    debounce(
      (value: string, func: ActionCreatorWithPayload<string, string>) => {
        dispatch(func(value));
      },
      500
    ),
    [dispatch]
  );

  const Filters = () => {
    return (
      <div>
        <hr className="my-4" />
        <div className="space-y-2">
          <div>
            <div className="pb-2">
              <label className="font-semibold">Minimum Price</label>
            </div>
            <Input
              type={"text"}
              placeholder="Min. Price.."
              onChange={(v) => {
                debounced(v.currentTarget.value, updateMinPriceFilter);
              }}
            />
          </div>

          <div>
            <div className="pb-2">
              <label className="font-semibold">Maximum Price</label>
            </div>
            <Input
              type={"text"}
              placeholder="Max. Price.."
              onChange={(v) => {
                debounced(v.currentTarget.value, updateMaxPriceFilter);
              }}
            />
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
          <Input
            type={"text"}
            placeholder={"search.."}
            onChange={(v) => {
              debounced(v.currentTarget.value, updateSearchFilter);
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
