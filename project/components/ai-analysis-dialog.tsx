import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface AIAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: string | null;
}

export function AIAnalysisDialog({ open, onOpenChange, analysis }: AIAnalysisDialogProps) {
  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Analysis</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Daily Performance Insights
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 whitespace-pre-line">
            {analysis.split('\n\n').map((section, i) => {
              const [title, ...content] = section.split('\n');
              return (
                <div key={i} className="space-y-2">
                  <h4 className="text-lg font-semibold text-primary">
                    {title.includes('SCORE') ? (
                      <div className="flex items-baseline gap-2">
                        <span>{title.replace('PRODUCTIVITY SCORE:', 'Score:')}</span>
                      </div>
                    ) : (
                      title
                    )}
                  </h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    {content.map((line, j) => (
                      <div key={j} className="pl-4">
                        {line.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
