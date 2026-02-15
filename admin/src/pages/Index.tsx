import LoginCard from "@/components/LoginCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div>
          <LoginCard />
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
