import { useEffect } from "react";
import SubscriptionList from "./components/SubscriptionList";
import SubscriptionFilters from "./components/SubscriptionFilters";
import { Plus, Info } from "lucide-react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { hydrateItems } from "./store/thunks/itemThunks";
import type { DateRangeFilter, Subscription } from "./utils/types";
import {
  updateEditingItem,
  updateDateFilter,
} from "./store/reducers/itemSlice";
import ModalContainer from "./components/Modal/ModalContainer";
import { setActiveModal } from "./store/reducers/modalSlice";

function App() {
  const items = useAppSelector((state) => state.item.items);
  const dispatch = useAppDispatch();

  const fetchSubscriptions = async () => {
    dispatch(hydrateItems());
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);
  useEffect(() => {
    const query = location.search.replace("?", "").split("&");
    for (const param of query) {
      const value = param.split("=");
      if (
        value[0] === "filter" &&
        (value[1] === "7-days" || value[1] === "30-days")
      ) {
        dispatch(updateDateFilter(value[1] as DateRangeFilter));
      }
    }
  }, []);

  return (
    <main className="bg-black text-white min-h-screen flex justify-center items-center">
      <div className="flex flex-wrap">
        <SubscriptionFilters />

        <div className="border border-white border-solid w-full">
          <div className="mb-2 p-2">
            <div className="space-x-2 mb-2 flex justify-end">
              <button
                onClick={() => dispatch(setActiveModal("info"))}
                className="bg-white text-black rounded-lg p-1 font-bold hover:cursor-pointer"
              >
                <Info />
              </button>
              <button
                onClick={() => dispatch(setActiveModal("editing"))}
                className="bg-white text-black rounded-lg p-1 font-bold hover:cursor-pointer"
              >
                <Plus />
              </button>
            </div>

            {items && (
              <SubscriptionList
                refresh={fetchSubscriptions}
                subscriptions={items}
                onEdit={(subscription: Subscription) => {
                  dispatch(updateEditingItem(subscription));
                  dispatch(setActiveModal("editing"));
                }}
              />
            )}
          </div>
        </div>
      </div>

      <ModalContainer />
    </main>
  );
}

export default App;
