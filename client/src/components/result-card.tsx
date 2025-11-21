import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type SummarizeResponse } from "@shared/schema";
import { Copy, RotateCcw, FileText, Image, File } from "lucide-react";

interface ResultCardProps {
  summary: SummarizeResponse;
  onResummarize: () => void;
}

export default function ResultCard({ summary, onResummarize }: ResultCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary.summary);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy summary to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = () => {
    switch (summary.type) {
      case 'pdf':
        return <File className="w-5 h-5 text-destructive" />;
      case 'image':
        return <Image className="w-5 h-5 text-secondary" />;
      default:
        return <FileText className="w-5 h-5 text-accent" />;
    }
  };

  const getTypeLabel = () => {
    switch (summary.type) {
      case 'pdf':
        return `PDF Document${summary.fileSize ? ` • ${(summary.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}`;
      case 'image':
        return `Image (OCR)${summary.fileSize ? ` • ${(summary.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}`;
      default:
        return 'Text Input • Pasted content';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div 
      className="result-card bg-card rounded-xl shadow-md border border-border overflow-hidden"
      data-testid={`card-result-${summary.id}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              summary.type === 'pdf' ? 'bg-destructive/10' :
              summary.type === 'image' ? 'bg-secondary/10' : 'bg-accent/10'
            }`}>
              {getTypeIcon()}
            </div>
            <div>
              <h4 
                className="font-semibold text-foreground"
                data-testid={`text-source-name-${summary.id}`}
              >
                {summary.sourceName}
              </h4>
              <p 
                className="text-sm text-muted-foreground"
                data-testid={`text-type-label-${summary.id}`}
              >
                {getTypeLabel()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopySummary}
              className="text-muted-foreground hover:text-accent transition-colors"
              title="Copy summary"
              data-testid={`button-copy-summary-${summary.id}`}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onResummarize}
              className="text-muted-foreground hover:text-secondary transition-colors"
              title="Summarize again"
              data-testid={`button-resummarize-${summary.id}`}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <p 
            className="text-foreground leading-relaxed"
            data-testid={`text-summary-${summary.id}`}
          >
            {summary.summary}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span 
            className="text-xs text-muted-foreground"
            data-testid={`text-timestamp-${summary.id}`}
          >
            Summarized {formatTimeAgo(summary.createdAt)}
          </span>
          <Button 
            onClick={handleCopySummary}
            className={`bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ${
              isAnimating ? 'scale-95' : 'scale-100'
            }`}
            data-testid={`button-copy-main-${summary.id}`}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Summary
          </Button>
        </div>
      </div>
    </div>
  );
}
