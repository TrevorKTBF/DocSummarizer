import { useState, useEffect } from "react";

interface ProcessingIndicatorProps {
  status: string;
}

export default function ProcessingIndicator({ status }: ProcessingIndicatorProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProgress(0);
  }, [status]);

  return (
    <div className="max-w-3xl mx-auto mb-8" data-testid="processing-indicator">
      <div className="bg-card rounded-xl shadow-md border border-border p-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="flex-1">
            <h4 
              className="font-medium text-foreground mb-2"
              data-testid="text-processing-status"
            >
              {status}
            </h4>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="progress-bar bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 95)}%` }}
                data-testid="progress-bar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
