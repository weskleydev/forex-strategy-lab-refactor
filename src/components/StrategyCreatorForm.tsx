import { useStrategyDraft } from "@/store/useStrategyDraft";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useIQStore } from "@/store/useIQStore";
import { Strategy } from "@/types";
import { CycleViewDialog } from "@/components/CycleViewDialog";
import { useToast } from "@/hooks/use-toast";

export function StrategyCreatorForm() {
  const { draft, setField, reset } = useStrategyDraft();
  const { session } = useIQStore();
  const { toast } = useToast();
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [candles, setCandles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>("EURUSD");

  const strategy: Strategy = {
    id: draft.id || "custom-estrategia",
    name: draft.name || "Nova Estratégia",
    description: "Estratégia personalizada baseada em quadrantes",
    timeframe: draft.timeframe || "M1",
    quadrantSize: draft.quadrantSize || 5,
    analysisSize: draft.analysisSize || (draft.referenceCandles?.length || 3),
    decisionRule: draft.decisionRule || "minority",
    entryOffset: draft.entryCandle !== undefined ? (Number(draft.entryCandle) % 10) % 3 : draft.entryOffset || 0,
  };

  const summary = useMemo(() => {
    const offsetLabel = strategy.entryOffset === 0 ? "0/5" : strategy.entryOffset === 1 ? "1/6" : "2/7";
    const ruleLabel = strategy.decisionRule === "minority" ? "Minoria" : "Maioria";
    return `Entrada ${offsetLabel}; decisão por ${ruleLabel}; análise de ${strategy.analysisSize} velas do quadrante anterior.`;
  }, [strategy]);

  const generateMockApiCandles = (count = 180) => {
    const out: any[] = [];
    const now = Math.floor(Date.now() / 1000);
    let base = 1.1720;
    for (let i = count - 1; i >= 0; i--) {
      const from = now - i * 60;
      const open = base + (Math.random() - 0.5) * 0.001;
      const close = open + (Math.random() - 0.5) * 0.0012;
      const max = Math.max(open, close) + Math.random() * 0.0006;
      const min = Math.min(open, close) - Math.random() * 0.0006;
      out.push({ id: from, from, to: from + 60, open, close, max, min, volume: Math.floor(Math.random() * 1000) });
      base = close;
    }
    return out;
  };

  const handlePreview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setCandles(generateMockApiCandles(180));
      setPreviewOpen(true);
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar candles");
      setPreviewOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const exportJSON = () => {
    const json = JSON.stringify(strategy, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${strategy.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Criar Estratégia</h3>
      <div className="space-y-3">
        <div>
          <Label>Nome</Label>
          <Input value={draft.name || ""} onChange={(e) => setField("name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Selecione um Timeframe</Label>
            <Select value={draft.timeframe || "M1"} onValueChange={(v) => setField("timeframe", v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="M1">M1</SelectItem>
                <SelectItem value="M5">M5</SelectItem>
                <SelectItem value="M15">M15</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Qual a frequência do Ciclo?</Label>
            <Select value={draft.cycleFrequency || "10min"} onValueChange={(v) => setField("cycleFrequency", v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5min">A cada 5 minutos</SelectItem>
                <SelectItem value="10min">A cada 10 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Identificador (ID)</Label>
          <Input value={draft.id || ""} onChange={(e) => setField("id", e.target.value)} />
        </div>
        <div>
          <Label>Regra de decisão</Label>
          <Select value={draft.decisionRule || "minority"} onValueChange={(v) => setField("decisionRule", v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="minority">Minoria</SelectItem>
              <SelectItem value="majority">Maioria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-2 border-t border-border my-2" />
        <div>
          <Label>Selecione as velas de referência</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const selected = (draft.referenceCandles || []).includes(n);
              return (
                <button
                  key={`ref-${n}`}
                  type="button"
                  onClick={() => {
                    const current = new Set(draft.referenceCandles || []);
                    if (current.has(n)) current.delete(n);
                    else current.add(n);
                    setField("referenceCandles", Array.from(current).sort((a, b) => a - b));
                    setField("analysisSize", Array.from(current).length);
                  }}
                  className={`h-12 w-12 rounded-md border transition-colors ${selected ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border"}`}
                >
                  {String(n).padStart(2, "0")}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>Como a referência deve ser analisada?</Label>
          <Select value={draft.decisionRule || "majority"} onValueChange={(v) => setField("decisionRule", v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="majority">Maioria (Entrada igual à maioria)</SelectItem>
              <SelectItem value="minority">Minoria (Entrada igual à minoria)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Selecione a vela de Entrada</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from({ length: 17 }, (_, i) => i + 1).map((n) => {
              const selected = (draft.entryCandle || 1) === n;
              return (
                <button
                  key={`entry-${n}`}
                  type="button"
                  onClick={() => setField("entryCandle", n)}
                  className={`h-12 w-12 rounded-md border transition-colors ${selected ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border"}`}
                >
                  {String(n).padStart(2, "0")}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>Como vai funcionar o seu martingale?</Label>
          <div className="flex items-center gap-3 mt-2">
            <Button
              type="button"
              variant={draft.mgMode === "sequenciado" ? "secondary" : "ghost"}
              onClick={() => setField("mgMode", "sequenciado")}
            >
              Sequenciado
            </Button>
            <Button
              type="button"
              variant={draft.mgMode === "alternado" ? "secondary" : "ghost"}
              onClick={() => setField("mgMode", "alternado")}
            >
              Alternado
            </Button>
          </div>
        </div>
        <div>
          <Label>Ativo para pré-visualização</Label>
          <Input value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">{summary}</p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Button onClick={handlePreview} disabled={isLoading}>
            Pré-visualizar
          </Button>
          <Button variant="secondary" onClick={exportJSON}>
            Exportar JSON
          </Button>
          <Button variant="ghost" onClick={reset}>
            Limpar
          </Button>
          <Button
            variant="default"
            onClick={() => {
              toast({
                title: "Alterações salvas",
                description: "Rascunho de estratégia atualizado",
              });
            }}
          >
            Salvar Alterações
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              reset();
              toast({
                title: "Estratégia deletada",
                description: "Rascunho foi limpo",
              });
            }}
          >
            Deletar
          </Button>
        </div>
      </div>
      <CycleViewDialog
        open={isPreviewOpen}
        onOpenChange={setPreviewOpen}
        data={{
          asset: { id: selectedAsset, symbol: selectedAsset, name: selectedAsset, isOpen: true } as any,
          strategy,
          metrics: { totalCycles: 0, wins: 0, hits: 0, winRate: 0, pWins: 0, g1Wins: 0, g2Wins: 0, pRate: 0, g1Rate: 0, g2Rate: 0, hitRate: 0 },
          cycles: [],
        }}
        candles={candles as any}
        isLoading={isLoading}
        error={error}
      />
    </Card>
  );
}
