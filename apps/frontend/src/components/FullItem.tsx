import { Category, Subscription } from "@/utils/types";
import { PencilIcon, TrashIcon } from "lucide-react";

interface FullItemProps {
  subscription: Subscription;
  categories: Category[];
  deleteItem: (id: number) => void;
  onEditClick: (sub: Subscription) => void;
}
export default function FullItem({
  subscription,
  categories,
  onEditClick,
  deleteItem,
}: FullItemProps) {
  const filteredCategory = categories.filter(
    (v) => v.id === subscription.categoryId,
  );

  return (
    <div className="bg-secondary/50 border border-border p-2 rounded-lg">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold">{subscription.name}</h1>
          <div className="flex flex-row space-x-2">
            <div className="border border-border p-1 rounded-lg">
              <p className="text-xs text-muted-foreground">
                {filteredCategory.length > 0
                  ? filteredCategory[0].name
                  : "None"}
              </p>
            </div>
            <p className="flex items-center text-xs">
              Next: {new Date(subscription.billingDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold">
              ${Number(subscription.price).toFixed(2)}
            </h1>
            <p className="text-muted-foreground text-xs">/month</p>
          </div>
          <div className="flex items-center space-x-4">
            <PencilIcon onClick={() => onEditClick(subscription)} width="20" />
            <TrashIcon onClick={() => deleteItem(subscription.id)} width="20" />
          </div>
        </div>
      </div>
    </div>
  );
}
