import SubscriptionItem from "./SubscriptionItem";
import type { Subscription } from "../utils/types";

export default function SubscriptionList({
  subscriptions,
  filterKeyword = "",
  refresh,
  onEdit,
}: {
  subscriptions: Subscription[] | undefined;
  filterKeyword?: string;
  refresh: () => void;
  onEdit: (subscription: Subscription) => void;
}) {
  return (
    <div className="border border-solid max-h-[50vh] overflow-y-auto border-white bg-zinc-800">
      {subscriptions && subscriptions.length > 0 ? (
        subscriptions
          .filter((v) => v.name.toLowerCase().includes(filterKeyword))
          .map((v, k) => {
            return (
              <SubscriptionItem
                refresh={refresh}
                onEdit={onEdit}
                key={k}
                subscription={v}
              />
            );
          })
      ) : (
        <div className="p-2 text-center">
          <h1 className="font-bold text-2xl">Uh oh!</h1>
          <p>No subscriptions created :*(</p>
        </div>
      )}
    </div>
  );
}
