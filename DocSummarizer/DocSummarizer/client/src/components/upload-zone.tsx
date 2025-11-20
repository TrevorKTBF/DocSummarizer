import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSummarizeFile, useSummarizeText } from "@/hooks/use-summarize";
import { Upload, Keyboard, FolderOpen } from "lucide-react";

interface UploadZoneProps {
  onProcessingStart: (status: string) => void;
  onProcessingEnd: () => void;
}

export default function UploadZone({ onProcessingStart, onProcessingEnd }: UploadZoneProps) {
  const [textInput, setTextInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fileMutation = useSummarizeFile({
    onMutate: () => onProcessingStart("Processing your document..."),
    onSettled: () => onProcessingEnd(),
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document summarized successfully!",
      });
    },
  });

  const textMutation = useSummarizeText({
    onMutate: () => onProcessingStart("Generating summary..."),
    onSettled: () => onProcessingEnd(),
    onError: (error) => {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setTextInput("");
      toast({
        title: "Success",
        description: "Text summarized successfully!",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, PNG, or JPG file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    fileMutation.mutate(file);
  };

  const handleTextSummarize = () => {
    if (!textInput.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to summarize.",
        variant: "destructive",
      });
      return;
    }

    if (textInput.trim().length < 10) {
      toast({
        title: "Text too short",
        description: "Please provide at least 10 characters to summarize.",
        variant: "destructive",
      });
      return;
    }

    textMutation.mutate(textInput);
  };

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        {/* File Upload Area */}
        <div 
          className={`drag-zone p-12 text-center border-2 border-dashed cursor-pointer transition-all duration-300 ${
            isDragOver 
              ? 'drag-over border-accent bg-accent/5' 
              : 'border-border bg-muted/30 hover:bg-muted/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          data-testid="drop-zone"
        >
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Drag & drop your files here
            </h3>
            <p className="text-muted-foreground mb-6">
              Support for PDF, PNG, JPG files up to 10MB
            </p>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-browse-files"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              data-testid="input-file"
            />
          </div>
        </div>

        {/* Text Input Area */}
        <div className="p-8 border-t border-border">
          <div className="flex items-center mb-4">
            <Keyboard className="w-5 h-5 text-accent mr-3" />
            <h3 className="text-lg font-semibold text-foreground">Or paste your text directly</h3>
          </div>
          <Textarea 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your text, terms & conditions, or any content you'd like summarized..."
            className="w-full h-32 resize-none focus:ring-2 focus:ring-ring"
            data-testid="textarea-text-input"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              <span data-testid="text-char-count">{textInput.length}</span> characters
            </span>
            <Button 
              onClick={handleTextSummarize}
              disabled={textMutation.isPending || !textInput.trim()}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-testid="button-summarize-text"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7,21Q6.175,21 5.588,20.413Q5,19.825 5,19V5Q5,4.175 5.588,3.587Q6.175,3 7,3H17Q17.825,3 18.413,3.587Q19,4.175 19,5V19Q19,19.825 18.413,20.413Q17.825,21 17,21ZM12,18Q12.425,18 12.713,17.713Q13,17.425 13,17Q13,16.575 12.713,16.287Q12.425,16 12,16Q11.575,16 11.287,16.287Q11,16.575 11,17Q11,17.425 11.287,17.713Q11.575,18 12,18ZM12,14Q12.425,14 12.713,13.713Q13,13.425 13,13V7Q13,6.575 12.713,6.287Q12.425,6 12,6Q11.575,6 11.287,6.287Q11,6.575 11,7V13Q11,13.425 11.287,13.713Q11.575,14 12,14Z"/>
              </svg>
              Summarize Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
