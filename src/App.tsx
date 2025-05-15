
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Conges from "./pages/Conges";
import ServiceDetails from "./pages/ServiceDetails";
import FindPro from "./pages/Employee";
import DemandesFinanciers from "./pages/DemandesFinanciers";
import MonCompte from "./pages/MonCompte";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employées" element={<FindPro />} />
          <Route path="/demandes-d'avances" element={<DemandesFinanciers />} />
          <Route path="/demandes-congés" element={<Conges />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/messageries" element={<MonCompte />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
