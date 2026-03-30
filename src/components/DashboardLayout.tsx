import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/lib/auth";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full grid-pattern">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/30 px-4 backdrop-blur-md bg-background/60 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-neon-cyan transition-colors" />
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse-neon" />
                <span className="text-xs font-mono text-muted-foreground">SYSTEM ONLINE</span>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground truncate">
              {user?.email}
            </span>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
