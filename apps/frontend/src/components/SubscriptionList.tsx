import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateItems } from "@/store/thunks/itemThunks";

import SubscriptionItem from "./SubscriptionItem";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SubscriptionList({ refresh }: { refresh: () => void }) {
  const dispatch = useAppDispatch();
  const { filters, items: subscriptions } = useAppSelector(
    (state) => state.item
  );

  useEffect(() => {
    const params = [];

    if (filters.dateRange && filters.dateRange !== "all-subscriptions") {
      params.push(`dateRange=${filters.dateRange}`);
    }
    if (filters.q) {
      params.push(`q=${filters.q}`);
    }
    if (filters.priceRangeMax) {
      params.push(`maxPrice=${filters.priceRangeMax}`);
    }
    if (filters.priceRangeMin) {
      params.push(`minPrice=${filters.priceRangeMin}`);
    }
    if (filters.sortBy && filters.sortBy !== "none") {
      params.push(`sortBy=${filters.sortBy}`);
    }
    if (filters.sortDirection && filters.sortDirection !== "desc") {
      params.push(`sortDirection=${filters.sortDirection}`);
    }

    dispatch(hydrateItems(params.join("&")));
  }, [filters]);

  if (subscriptions && subscriptions.length > 0) {
    return (
      <ScrollArea className="h-72">
        {subscriptions.map((v, k) => {
          return (
            <SubscriptionItem refresh={refresh} key={k} subscription={v} />
          );
        })}
      </ScrollArea>
    );
  } else {
    return (
      <div className="p-2 text-center">
        <h1 className="font-bold text-2xl">Uh oh!</h1>
        <p>No subscriptions created :*(</p>
      </div>
    );
  }
}
