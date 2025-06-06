import { type ReactNode } from "react";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed top-0 bottom-0 left-0 right-0 select-none flex justify-center items-center z-10 bg-black/90"
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
