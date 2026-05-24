import { Subscription } from "@/utils/types";

interface CompactItemProps {
  subscription: Subscription;
}
export default function CompactItem() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold">
        <p>S</p>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">Spotify</h4>
        <p className="text-sm text-muted-foreground">May 10th</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-primary">$12.99</p>
      </div>
    </div>
  );
}
