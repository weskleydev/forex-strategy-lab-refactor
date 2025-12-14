import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Estrategias from "./pages/Estrategias";
import Ativos from "./pages/Ativos";
import Auth from "./pages/Auth";
import IQLogin from "./pages/IQLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/iq-login" element={<ProtectedRoute><IQLogin /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/ativos" element={<ProtectedRoute><Ativos /></ProtectedRoute>} />
          <Route path="/estrategias" element={<ProtectedRoute><Estrategias /></ProtectedRoute>} />
          <Route path="/ferramentas" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
