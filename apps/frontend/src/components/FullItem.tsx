import { Subscription } from "@/utils/types";
import { PencilIcon, TrashIcon } from "lucide-react";

interface FullItemProps {
  subscription: Subscription;
}
export default function FullItem() {
  return (
    <div className="bg-secondary/50 border border-border p-2 rounded-lg">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold">Spotify</h1>
          <div className="flex flex-row space-x-2">
            <div className="border border-border p-1 rounded-lg">
              <p className="text-xs text-muted-foreground">Entertainment</p>
            </div>
            <p className="flex items-center text-xs">Next: June 12th</p>
          </div>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold">$9.99</h1>
            <p className="text-muted-foreground text-xs">/month</p>
          </div>
          <div className="flex items-center space-x-4">
            <PencilIcon width="20" />
            <TrashIcon width="20" />
          </div>
        </div>
      </div>
    </div>
  );
}
