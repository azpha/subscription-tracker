import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  headerButtons?: ReactNode | ReactNode[];
}
export default function Header({ headerButtons }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1
          className="text-2xl font-bold hover:cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Tracker
        </h1>
        <p className="text-sm opacity-50">Track your upcoming subscriptions</p>
      </div>
      {/* {headerButtonAction && headerButtonLabel && ( */}
      {headerButtons && (
        <div className="flex flex-row items-center my-2 md:my-0 space-x-2">
          {headerButtons}
        </div>
      )}
    </>
  );
}
