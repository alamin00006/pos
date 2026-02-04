import { Play } from "lucide-react";

interface VideoTestimonialProps {
  title: string;
  thumbnailUrl: string;
  direction?: "left" | "right";
}

const VideoTestimonial = ({ title, thumbnailUrl, direction = "left" }: VideoTestimonialProps) => {
  const animationClass = direction === "left" ? "animate-slide-in-left" : "animate-slide-in-right";
  
  return (
    <div className={`space-y-4 ${animationClass}`} style={{ animationDelay: "0.2s" }}>
      <h3 className="text-lg font-semibold text-foreground text-center">
        Customer Review
      </h3>
      <div className="video-card group cursor-pointer">
        <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm font-medium line-clamp-2">
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTestimonial;
