import { Info, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  onRandomDestination: () => void;
}

export function Footer({ onRandomDestination }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-t border-border">
      <div className="h-full px-4 flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-accent hover:shadow-glow transition-all"
        >
          <Info className="h-4 w-4" />
          About
        </Button>
        
        <div className="w-px h-6 bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRandomDestination}
          className="gap-2 hover:bg-accent hover:shadow-glow transition-all"
        >
          <Shuffle className="h-4 w-4" />
          Random Destination
        </Button>
      </div>
    </footer>
  );
}