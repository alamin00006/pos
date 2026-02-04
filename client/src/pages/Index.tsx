import LoginCard from "@/components/LoginCard";
import VideoTestimonial from "@/components/VideoTestimonial";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
          {/* Left Video */}
          <div className="hidden lg:block">
            <VideoTestimonial
              title="সফটওয়্যার খাতে কোটি কোটি টাকা বাহিরে চলে যাচ্ছে | দেশকে মূল্যায়ন না করায় | POS software company"
              thumbnailUrl={testimonial1}
              direction="left"
            />
          </div>

          {/* Center Login Card */}
          <div className="flex justify-center">
            <LoginCard />
          </div>

          {/* Right Video */}
          <div className="hidden lg:block">
            <VideoTestimonial
              title="বড় বড় কোম্পানি এখন SOFTGHOR LIMITED থেকে POS সফটওয়্যার নিচ্ছে | ব্যবসার হিসাব খুব EASY"
              thumbnailUrl={testimonial2}
              direction="right"
            />
          </div>
        </div>

        {/* Mobile Videos */}
        <div className="lg:hidden mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <VideoTestimonial
            title="সফটওয়্যার খাতে কোটি কোটি টাকা বাহিরে চলে যাচ্ছে | দেশকে মূল্যায়ন না করায়"
            thumbnailUrl={testimonial1}
            direction="left"
          />
          <VideoTestimonial
            title="বড় বড় কোম্পানি এখন SOFTGHOR LIMITED থেকে POS সফটওয়্যার নিচ্ছে"
            thumbnailUrl={testimonial2}
            direction="right"
          />
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
