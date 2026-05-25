import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode | ReactNode[];
  headerButtons?: ReactNode | ReactNode[];
}
export default function Layout({ children, headerButtons }: LayoutProps) {
  return (
    <div className="bg-black min-h-screen flex justify-center text-white dark">
      <div className="w-full md:max-w-7xl m-10">
        <div className="flex md:flex-row flex-col justify-between">
          <Header headerButtons={headerButtons} />
        </div>
        {children}
      </div>
    </div>
  );
}
