import { useEffect } from "react";
import { Plus, Info } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SubscriptionList from "@/components/SubscriptionList";
import SubscriptionFilters from "@/components/SubscriptionFilters";
import { useAppDispatch } from "@/store/hooks";
import { hydrateItems } from "@/store/thunks/itemThunks";
import { updateDateFilter } from "@/store/reducers/itemSlice";
import type { DateRangeFilter } from "@/utils/types";
import SubscriptionForm from "./components/Modal/SubscriptionForm";

function App() {
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
              <Button className="bg-white text-black hover:bg-zinc-400">
                <Info />
              </Button>
              <Dialog>
                <DialogTrigger>
                  <Button className="bg-white text-black hover:bg-zinc-400">
                    <Plus />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-fit bg-zinc-800 text-white">
                  <SubscriptionForm />
                </DialogContent>
              </Dialog>
            </div>

            <SubscriptionList refresh={fetchSubscriptions} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
