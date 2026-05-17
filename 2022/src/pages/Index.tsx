import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { DestinationScroller } from '@/components/DestinationScroller';
import { DestinationTiles } from '@/components/DestinationTiles';
import { DestinationTable } from '@/components/DestinationTable';
import { ViewType, SortField, SortOrder, Destination } from '@/types/destination';
import { destinations as allDestinations } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [viewType, setViewType] = useState<ViewType>('scroll');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let filtered = [...allDestinations];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(d => d.type === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.tagline.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField as keyof Destination] as string | number;
      let bValue: string | number = b[sortField as keyof Destination] as string | number;

      if (sortField === 'rating') {
        aValue = a.stats?.rating || 0;
        bValue = b.stats?.rating || 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortField, sortOrder]);

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setRightSidebarOpen(true);
  };

  const handleRandomDestination = () => {
    const randomIndex = Math.floor(Math.random() * allDestinations.length);
    handleDestinationClick(allDestinations[randomIndex]);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <LeftSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onSearch={setSearchQuery}
        />
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          "ml-16 lg:ml-64", // Account for sidebar
          rightSidebarOpen ? "mr-96" : "mr-0"
        )}>
          {/* View Switcher */}
          <div className="fixed top-16 left-16 lg:left-64 right-0 z-30 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 gap-2">
            <Button
              variant={viewType === 'scroll' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('scroll')}
              className="gap-2"
            >
              <ScrollText className="h-4 w-4" />
              Scroll
            </Button>
            <Button
              variant={viewType === 'tiles' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('tiles')}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Tiles
            </Button>
            <Button
              variant={viewType === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('table')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Table
            </Button>
            
            <div className="ml-auto text-sm text-muted-foreground">
              {filteredDestinations.length} destinations
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-14">
            {viewType === 'scroll' && (
              <DestinationScroller
                destinations={filteredDestinations}
                onDestinationClick={handleDestinationClick}
              />
            )}
            
            {viewType === 'tiles' && (
              <DestinationTiles
                destinations={filteredDestinations}
                onDestinationClick={handleDestinationClick}
              />
            )}
            
            {viewType === 'table' && (
              <DestinationTable
                destinations={filteredDestinations}
                onDestinationClick={handleDestinationClick}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            )}
          </div>
        </main>

        <RightSidebar
          destination={selectedDestination}
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
        />
      </div>

      <Footer onRandomDestination={handleRandomDestination} />
    </div>
  );
};

export default Index;
