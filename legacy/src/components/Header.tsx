import { User, Settings, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
            <span className="text-primary-foreground font-bold text-xl">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-bold text-lg leading-tight">MTD</span>
            <span className="text-muted-foreground text-xs">Morocco Top Destinations</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent hover:shadow-glow transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Link to="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent hover:shadow-glow transition-all"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/account">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent hover:shadow-glow transition-all"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}