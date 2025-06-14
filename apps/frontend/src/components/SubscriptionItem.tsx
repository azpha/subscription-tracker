import type { Subscription } from "@/utils/types";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import SubscriptionForm from "@/components/Modal/SubscriptionForm";

export default function SubscriptionItem({
  subscription,
  refresh,
}: {
  subscription: Subscription;
  refresh: () => void;
}) {
  const handleDeletion = async () => {
    await api.deleteItem(subscription.id!);
    refresh();
  };

  return (
    <Dialog>
      <Card className="bg-zinc-800 text-white">
        <CardHeader>
          <h1 className="text-2xl font-bold">{subscription.name}</h1>
          <div className="text-sm opacity-75">
            <p>
              ${Number(subscription.price).toFixed(2)},{" "}
              {subscription.paymentMethod}
            </p>
            <p>{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
          </div>
          <CardAction className="flex flex-col space-y-2">
            <DialogTrigger>
              <Button>Edit</Button>
            </DialogTrigger>
            <Button
              onClick={handleDeletion}
              className={"hover:bg-red-950 text-white rounded-lg p-2"}
            >
              Delete
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
      <DialogContent className="w-fit bg-zinc-800 text-white">
        <SubscriptionForm subscription={subscription} />
      </DialogContent>
    </Dialog>
  );
}
