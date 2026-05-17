import { useState } from 'react';
import { Search, MapPin, Waves, Mountain, Building, Palmtree, Landmark, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface LeftSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onSearch: (query: string) => void;
}

const categories = [
  { id: 'all', label: 'All Destinations', icon: MapPin },
  { id: 'city', label: 'Cities', icon: Building },
  { id: 'beach', label: 'Beaches', icon: Waves },
  { id: 'mountain', label: 'Mountains', icon: Mountain },
  { id: 'desert', label: 'Desert', icon: Palmtree },
  { id: 'historical', label: 'Historical', icon: Landmark },
];

export function LeftSidebar({ selectedCategory, onCategorySelect, onSearch }: LeftSidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
    setSearchOpen(false);
  };

  return (
    <>
      <aside className={cn(
        "fixed left-0 top-16 bottom-14 z-40 bg-sidebar-background border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="h-full flex flex-col">
          {/* Collapse Toggle */}
          <div className="p-2 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hover:bg-sidebar-accent"
            >
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "" : "rotate-180"
              )} />
            </Button>
          </div>

          {/* Search Button */}
          <div className="px-3 pb-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 hover:bg-sidebar-accent hover:shadow-glow"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              {!collapsed && <span>Search Destinations</span>}
            </Button>
          </div>

          {/* Categories */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 pb-4">
              {!collapsed && (
                <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Topics
                </h3>
              )}
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id || (selectedCategory === null && category.id === 'all');
                
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 transition-all",
                      isActive ? "bg-sidebar-accent text-sidebar-primary shadow-glow" : "hover:bg-sidebar-accent/50",
                      collapsed && "px-2"
                    )}
                    onClick={() => onCategorySelect(category.id === 'all' ? null : category.id)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{category.label}</span>}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Search Destinations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Search by name, tag, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-input border-border focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSearchOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}