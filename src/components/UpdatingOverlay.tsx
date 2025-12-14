import { Loader2, X } from "lucide-react";
import { useIQStore } from "@/store/useIQStore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function UpdatingOverlay() {
  const { isUpdatingData, updateMessage, updateError, cancelDataUpdate, isConnected } = useIQStore();

  if (!isUpdatingData && !updateError) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[90%] max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-xl"
      >
        <div className="flex items-center justify-center mb-4">
          {updateError ? (
            <X className="h-8 w-8 text-destructive" />
          ) : (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          )}
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">
          {updateError ? "Falha ao atualizar" : "Atualizando dados..."}
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          {updateError
            ? updateError
            : "Carregando pares, lucros e saldo em tempo real. Aguarde alguns instantes."}
        </p>
        <div className="flex items-center justify-center gap-3">
          {updateError ? (
            <Button variant="default" onClick={cancelDataUpdate}>
              Fechar
            </Button>
          ) : (
            <Button variant="ghost" onClick={cancelDataUpdate}>
              Cancelar
            </Button>
          )}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {isConnected ? "Conexão com a corretora ativa" : "Reconectando à corretora"}
        </div>
      </motion.div>
    </div>
  );
}
