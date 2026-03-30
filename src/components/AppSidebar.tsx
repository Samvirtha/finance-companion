import { LayoutDashboard, PlusCircle, Brain, Bell, LogOut, Sun, Moon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/lib/theme";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Add Expense", url: "/add-expense", icon: PlusCircle },
  { title: "Insights", url: "/insights", icon: Brain },
  { title: "Alerts", url: "/alerts", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-4">
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-primary">
                FinAI
              </span>
            )}
            {collapsed && <span className="text-lg font-bold text-primary">F</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 space-y-2">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={toggle}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
        </Button>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={() => window.location.href = "/"}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
