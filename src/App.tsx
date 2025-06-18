
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlanProvider } from "./contexts/PlanContext";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { EmailVerificationPage } from "./pages/EmailVerificationPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CalendarView } from "./pages/CalendarView";
import { Performance } from "./pages/Performance";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PlanProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CalendarView />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Performance />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PlanProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
