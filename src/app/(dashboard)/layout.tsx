import { FC, ReactNode } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import { ContextProvider } from "@/context/Context";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

const Layout: FC<{ children: ReactNode }> = async ({ children }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <ProtectedRoutes>
      <ContextProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </ContextProvider>
    </ProtectedRoutes>
  );
};

export default Layout;
