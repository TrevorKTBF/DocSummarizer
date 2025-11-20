import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">SummaryFlow</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Transform any document into clear, actionable summaries with the power of AI. Fast, secure, and incredibly easy to use.
          </p>
          <div className="space-y-2">
            <p>
              <a 
                href="mailto:Trevorcaireswork@gmail.com" 
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="link-email"
              >
                Trevorcaireswork@gmail.com
              </a>
            </p>
            <p>
              <a 
                href="https://Outreachwebdesign.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="link-website"
              >
                Outreachwebdesign.com
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 OutreachWebDesign. All rights reserved. Your documents are processed securely and never stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
