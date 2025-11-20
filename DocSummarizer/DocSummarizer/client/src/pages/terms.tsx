import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
              
              <div className="prose prose-lg max-w-none text-foreground">
                <h2 className="text-2xl font-semibold mb-4">1. Service Description</h2>
                <p className="mb-6 text-muted-foreground">
                  SummaryFlow provides AI-powered document summarization services. Users can upload PDF files, 
                  images, or paste text to receive automated summaries generated using artificial intelligence.
                </p>

                <h2 className="text-2xl font-semibold mb-4">2. Data Processing</h2>
                <p className="mb-6 text-muted-foreground">
                  Files and text submitted to our service are processed temporarily to generate summaries. 
                  We do not permanently store your uploaded documents or personal content. All processing 
                  is done securely and your data is automatically deleted after processing.
                </p>

                <h2 className="text-2xl font-semibold mb-4">3. Usage Limitations</h2>
                <p className="mb-6 text-muted-foreground">
                  File uploads are limited to 10MB per file. Supported formats include PDF, PNG, and JPG. 
                  Users are responsible for ensuring they have the right to process and summarize any 
                  content they submit to our service.
                </p>

                <h2 className="text-2xl font-semibold mb-4">4. Privacy</h2>
                <p className="mb-6 text-muted-foreground">
                  We respect your privacy and handle your data in accordance with our privacy policy. 
                  Your documents are processed securely and are not shared with third parties except 
                  as necessary to provide the summarization service.
                </p>

                <h2 className="text-2xl font-semibold mb-4">5. Service Availability</h2>
                <p className="mb-6 text-muted-foreground">
                  While we strive to maintain high availability, we cannot guarantee uninterrupted service. 
                  We reserve the right to modify or discontinue the service with reasonable notice.
                </p>

                <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
                <p className="mb-6 text-muted-foreground">
                  If you have questions about these terms or our service, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
