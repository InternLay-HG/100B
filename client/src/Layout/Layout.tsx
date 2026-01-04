import SidebarMenu from "@/components/SidebarMenu";
import { Outlet } from "react-router-dom";

interface LayoutProps {
    children?: React.ReactNode;
  }

const Layout = ({children}: LayoutProps) => {
  return (
    <div className="flex">
        <SidebarMenu />
        {children}
        <Outlet />
    </div>
  )
}

export default Layout;