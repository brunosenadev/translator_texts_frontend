import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { AppSidebarInset } from "./app-sidebar-inset";
import Login from "@/app/login/page";

type ProviderProps = {
  children: React.ReactNode;
};

export async function Providers({ children }: ProviderProps) {
  const cookieStore = cookies();

  const isLoggedIn = cookieStore.get("loggedIn")?.value === "true";

  const sidebarState = cookieStore.get("sidebar:state")?.value;
  const sidebarWidth = cookieStore.get("sidebar:width")?.value;

  let defaultOpen = true;
  if (sidebarState) {
    defaultOpen = sidebarState === "true";
  }

  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      {isLoggedIn ? (
        <SidebarProvider defaultOpen={defaultOpen} defaultWidth={sidebarWidth}>
          <AppSidebar>
            <AppSidebarInset>{children}</AppSidebarInset>
          </AppSidebar>
        </SidebarProvider>
      ) : (
        <Login />
      )}
    </ThemeProvider>
  );
}
