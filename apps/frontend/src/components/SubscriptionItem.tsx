import type { Subscription } from "../utils/types";
import api from "../utils/api";

export default function SubscriptionItem({
  subscription,
  refresh,
  onEdit,
}: {
  subscription: Subscription;
  refresh: () => void;
  onEdit: (subscription: Subscription) => void;
}) {
  const handleDeletion = async () => {
    await api.deleteItem(subscription.id!);
    refresh();
  };

  return (
    <div className="relative w-full border border-solid p-2 bg-zinc-800">
      <div className="inline-block">
        <h1 className="text-2xl font-bold inline">{subscription.name}</h1>

        <div className="text-sm opacity-75">
          <p>
            ${subscription.price}, {subscription.paymentMethod}
          </p>
          <p>{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
        </div>
      </div>

      <button
        type={"button"}
        onClick={() => onEdit(subscription)}
        className={
          "bg-zinc-900 text-white rounded-lg p-2 absolute right-4 bottom-6"
        }
      >
        Edit
      </button>
      <button
        type={"button"}
        onClick={handleDeletion}
        className={
          "bg-red-950 text-white rounded-lg p-2 absolute right-16 bottom-6"
        }
      >
        Delete
      </button>
    </div>
  );
}
