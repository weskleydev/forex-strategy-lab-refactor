import { Topbar } from "@/components/Topbar";
import { motion } from "framer-motion";
import { StrategyCreatorForm } from "@/components/StrategyCreatorForm";

export default function Estrategias() {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Estratégias</h1>
          <p className="text-muted-foreground mt-1">Criação e pré-visualização local de estratégias.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <StrategyCreatorForm />
          </div>
        </div>
      </main>
    </div>
  );
}
