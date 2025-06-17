import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Absence from "./pages/absences";

import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import IndexEmp from "./pages/IndexEmp";
import MyConges from "./pages/MyConges";
import MyDemandesFinanciers from "./pages/MyDemandesFinanciers";
import Conges from "./pages/Conges";
import DemandesFinanciers from "./pages/DemandesFinanciers";
import FindPro from "./pages/Employee";
import MonCompte from "./pages/MonCompte";
import ServiceDetails from "./pages/ServiceDetails";
import Messagerie from "./pages/Messagerie";
import Annonces from "./pages/Annonces";
import NotFound from "./pages/NotFound";

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
      <ShadcnToaster />
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* === Admin Routes === */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Dashboard />
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
            path="/demandes-congés"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Conges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/demandes-d-avances"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <DemandesFinanciers />
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
            path="/absences"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Absence />
              </ProtectedRoute>
            }
          />

          <Route
            path="/annonces"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Annonces />
              </ProtectedRoute>
            }
          />

          {/* === Shared Route (Admin + Employé) === */}
          <Route
            path="/messageries"
            element={
              <ProtectedRoute allowedRoles={[2, 3]}>
                <Messagerie />
              </ProtectedRoute>
            }
          />

          {/* === Employé Routes === */}
          <Route
            path="/myEmpAccount"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <IndexEmp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-demandes-congés"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <MyConges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-demandes-d-avances"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <MyDemandesFinanciers />
              </ProtectedRoute>
            }
          />

          {/* === 404 === */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
