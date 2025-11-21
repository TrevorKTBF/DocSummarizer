import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import UploadZone from "@/components/upload-zone";
import ResultCard from "@/components/result-card";
import ProcessingIndicator from "@/components/processing-indicator";
import { type SummarizeResponse } from "@shared/schema";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  // Fetch all summaries for session history
  const { data: summaries = [], refetch } = useQuery<SummarizeResponse[]>({
    queryKey: ["/api/summaries"],
  });

  const handleProcessingStart = (status: string) => {
    setIsProcessing(true);
    setProcessingStatus(status);
  };

  const handleProcessingEnd = () => {
    setIsProcessing(false);
    setProcessingStatus("");
    refetch();
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            Instant Document Summaries
          </h2>
          <div className="space-y-3 text-xl text-muted-foreground max-w-2xl mx-auto">
            <p>Drop in or paste your text, PDF, or photo, and we'll read it for you.</p>
            <p>In seconds, get a crystal-clear summary.</p>
          </div>
        </div>

        {/* Upload Zone */}
        <UploadZone 
          onProcessingStart={handleProcessingStart}
          onProcessingEnd={handleProcessingEnd}
        />

        {/* Processing Indicator */}
        {isProcessing && (
          <ProcessingIndicator status={processingStatus} />
        )}

        {/* Results Section */}
        {summaries.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="space-y-6">
              {summaries.map((summary) => (
                <ResultCard 
                  key={summary.id} 
                  summary={summary}
                  onResummarize={() => {
                    // TODO: Implement re-summarization
                    console.log("Re-summarize:", summary.id);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="max-w-6xl mx-auto mt-24 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose SummaryFlow?</h3>
            <p className="text-xl text-muted-foreground">Powerful AI meets intuitive design</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Lightning Fast</h4>
              <p className="text-muted-foreground">No AI knowledge needed! Drop in your file or text and get the important parts.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,12.1 16,12.8 16,14V20H8V14C8,12.8 8.6,12.1 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.9 10.5,10V11.5H13.5V10C13.5,8.9 12.8,8.2 12,8.2Z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Secure & Private</h4>
              <p className="text-muted-foreground">Your documents are processed securely and never stored permanently on our servers.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7,21Q6.175,21 5.588,20.413Q5,19.825 5,19V5Q5,4.175 5.588,3.587Q6.175,3 7,3H17Q17.825,3 18.413,3.587Q19,4.175 19,5V19Q19,19.825 18.413,20.413Q17.825,21 17,21ZM12,18Q12.425,18 12.713,17.713Q13,17.425 13,17Q13,16.575 12.713,16.287Q12.425,16 12,16Q11.575,16 11.287,16.287Q11,16.575 11,17Q11,17.425 11.287,17.713Q11.575,18 12,18ZM12,14Q12.425,14 12.713,13.713Q13,13.425 13,13V7Q13,6.575 12.713,6.287Q12.425,6 12,6Q11.575,6 11.287,6.287Q11,6.575 11,7V13Q11,13.425 11.287,13.713Q11.575,14 12,14Z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Smart AI</h4>
              <p className="text-muted-foreground">Advanced AI understands context and creates accurate, concise summaries every time.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
