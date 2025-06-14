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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
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
            <Select
              onValueChange={(v) =>
                dispatch(updateDateFilter(v as DateRangeFilter))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    <SelectItem value={"all-subscriptions"}>
                      All subscriptions
                    </SelectItem>
                    <SelectItem value={"7-days"}>7 days</SelectItem>
                    <SelectItem value={"30-days"}>30 days</SelectItem>
                  </SelectLabel>
                </SelectGroup>
              </SelectContent>
            </Select>
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
            <Select
              onValueChange={(v) =>
                dispatch(updateSortByFilter(v as SortByFilter))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"none"}>None</SelectItem>
                  <SelectItem value={"price"}>Price</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="pb-2">
              <label className="font-semibold">Sort Direction</label>
            </div>
            <Select
              onValueChange={(v) =>
                dispatch(updateSortDirectionFilter(v as SortDirectionFilter))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"desc"}>Descending</SelectItem>
                  <SelectItem value={"asc"}>Ascending</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
        <Button
          onClick={() => {
            setShowFilters(false);
            setShowSort(!showSort);
            dispatch(resetFilters());
          }}
          className="bg-white text-black hover:bg-zinc-400 rounded-lg p-2 font-bold hover:cursor-pointer"
        >
          <SortAsc />
        </Button>
        <Button
          onClick={() => {
            setShowSort(false);
            setShowFilters(!showFilters);
            dispatch(resetFilters());
          }}
          className="bg-white text-black hover:bg-zinc-400 rounded-lg p-2 font-bold hover:cursor-pointer"
        >
          <Filter />
        </Button>
      </div>

      {showFilters && <Filters />}
      {showSort && <Sort />}
    </div>
  );
}
