import { useState } from "react";
import type { CurrentFilter } from "../utils/types";

export default function SubscriptionFilters({
  currentFilter,
  setCurrentFilter,
  setSearchQuery,
}: {
  currentFilter: CurrentFilter;
  setCurrentFilter: (v: CurrentFilter) => void;
  setSearchQuery: (v: string) => void;
}) {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const Filters = () => {
    return (
      <div>
        <hr className="my-4" />
        <div className="pb-2">
          <label className="font-semibold">Renewal Period</label>
        </div>
        <div>
          <select
            onChange={(e) => setCurrentFilter(e.target.value as CurrentFilter)}
            className="bg-white w-full p-2 text-black"
            id="renewal"
            value={currentFilter}
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
          <input
            type={"text"}
            placeholder={"search.."}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="bg-white text-black rounded-lg p-2 w-full"
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
