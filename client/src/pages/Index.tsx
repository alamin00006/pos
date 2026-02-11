import LoginCard from "@/components/LoginCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
          {/* Center Login Card */}
          <div className="flex justify-center">
            <LoginCard />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>
          Copyright © 2026{" "}
          <a href="#" className="text-primary hover:underline">
            SoftGhor
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
