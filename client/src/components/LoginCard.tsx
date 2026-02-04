"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to SoftGhor POS",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };
  return (
    <div className="login-card animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">POS</span>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              SOFT<span className="text-primary">GHOR</span>
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              More than a software company
            </p>
          </div>
        </div>
      </div>

      {/* Sign In Header */}
      <h2 className="text-lg font-semibold text-foreground mb-6">Sign in</h2>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">
            User Email...
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@softghor.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-0 border-b-2 border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-0 border-b-2 border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="remember"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-base font-medium bg-primary hover:bg-accent transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "LOGIN"
          )}
        </Button>
      </form>

      {/* Contact Info */}
      <div className="mt-8 pt-6 border-t border-border space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            For New Orders:
          </h3>
          <div className="space-y-1">
            <a href="tel:01958104255" className="contact-item text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>01958-104255</span>
            </a>
            <a href="tel:01958104250" className="contact-item text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>01958-104250</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            For Support:
          </h3>
          <div className="space-y-1">
            <a href="tel:01958104256" className="contact-item text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>01958-104256 (11 AM - 08 PM)</span>
            </a>
            <a href="tel:01958104257" className="contact-item text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>01958-104257 (11 AM - 08 PM)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
