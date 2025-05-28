import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Conges from "./pages/Conges";
import ServiceDetails from "./pages/ServiceDetails";
import FindPro from "./pages/Employee";
import DemandesFinanciers from "./pages/DemandesFinanciers";
import MonCompte from "./pages/MonCompte";
import NotFound from "./pages/NotFound";
import IndexEmp from "./pages/IndexEmp";
import MyConges from "./pages/MyConges";
import MyDemandesFinanciers from "./pages/MyDemandesFinanciers";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !allowedRoles.includes(user.id_role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myEmpAccount"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <IndexEmp />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mes-demandes-conges"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <MyConges />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employées"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <FindPro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-demandes-d'avances"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <MyDemandesFinanciers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/demandes-d'avances"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <DemandesFinanciers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/demandes-congés"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Conges />
              </ProtectedRoute>
            }
          />

          <Route
            path="/service/:id"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <ServiceDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messageries"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <MonCompte />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
