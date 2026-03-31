import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { fetchProfile } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import AddExpensePage from "./pages/AddExpensePage";
import InsightsPage from "./pages/InsightsPage";
import AlertsPage from "./pages/AlertsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background grid-pattern">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function ProfileGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background grid-pattern">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile?.profile_completed) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><ProfileGate><DashboardPage /></ProfileGate></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileGate><ProfilePage /></ProfileGate></ProtectedRoute>} />
      <Route path="/add-expense" element={<ProtectedRoute><ProfileGate><AddExpensePage /></ProfileGate></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><ProfileGate><InsightsPage /></ProfileGate></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><ProfileGate><AlertsPage /></ProfileGate></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
