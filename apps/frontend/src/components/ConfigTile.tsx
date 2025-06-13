import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function ConfigTile({
  icon,
  title,
  action,
  actionLabel,
  actionDisabled = false,
  message,
}: {
  icon: ReactNode;
  title: string;
  actionLabel: string;
  actionDisabled?: boolean;
  action: () => void;
  message?: ReactNode;
}) {
  return (
    <div className="rounded-lg p-2 border-solid border-black/90 bg-zinc-900 w-fit text-center">
      {icon}

      <h1 className="font-semibold">{title}</h1>
      {actionDisabled && (
        <Button
          disabled={true}
          className="bg-white text-center text-black hover:bg-zinc-500 font-semibold my-2 p-2 text-sm rounded-lg"
        >
          <p className="font-semibold text-red-500 my-2">Disabled</p>
        </Button>
      )}
      {!actionDisabled && (
        <>
          <Button
            onClick={action}
            disabled={actionDisabled}
            className="bg-white text-center text-black hover:bg-zinc-500 font-semibold my-2 p-2 text-sm rounded-lg"
          >
            {actionLabel}
          </Button>
          {message}
        </>
      )}
    </div>
  );
}
