import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Heart, Share2, Info, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Destination } from '@/types/destination';
import { cn } from '@/lib/utils';

interface DestinationScrollerProps {
  destinations: Destination[];
  onDestinationClick: (destination: Destination) => void;
}

export function DestinationScroller({ destinations, onDestinationClick }: DestinationScrollerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentDestination = destinations[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowDown' && currentIndex < destinations.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, destinations.length]);

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'down' && currentIndex < destinations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentDestination) return null;

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-7rem-3.5rem)] bg-black">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {currentDestination.video ? (
          <video
            key={currentDestination.id}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={muted}
            playsInline
          >
            <source src={currentDestination.video} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentDestination.images[0] || '/placeholder.jpg'})`,
            }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 pb-12">
        <div className="max-w-2xl space-y-4">
          {/* Title and Tagline */}
          <div>
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-xl">
              {currentDestination.title}
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg">
              {currentDestination.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="text-white/80 text-lg leading-relaxed max-w-xl drop-shadow-md">
            {currentDestination.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {currentDestination.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm text-white border border-white/20"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Quote */}
          {currentDestination.quote && (
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <p className="text-white/90 italic">"{currentDestination.quote.text}"</p>
              <p className="text-white/70 text-sm mt-2">— {currentDestination.quote.author}</p>
            </div>
          )}
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute right-8 bottom-1/3 flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
        >
          <Heart className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
        >
          <Share2 className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDestinationClick(currentDestination)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
        >
          <Info className="h-5 w-5" />
        </Button>

        {currentDestination.video && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMuted(!muted)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleScroll('up')}
          disabled={currentIndex === 0}
          className={cn(
            "w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20",
            currentIndex === 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <span className="text-white/70 text-xs">
            {currentIndex + 1} / {destinations.length}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleScroll('down')}
          disabled={currentIndex === destinations.length - 1}
          className={cn(
            "w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20",
            currentIndex === destinations.length - 1 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-2">
          {destinations.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-1 h-12 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "bg-white w-2"
                  : idx < currentIndex
                  ? "bg-white/50"
                  : "bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}