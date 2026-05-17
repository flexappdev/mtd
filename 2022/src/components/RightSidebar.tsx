import { X, MapPin, Calendar, Thermometer, Users, ExternalLink, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Destination } from '@/types/destination';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RightSidebar({ destination, isOpen, onClose }: RightSidebarProps) {
  if (!destination) return null;

  return (
    <aside className={cn(
      "fixed right-0 top-16 bottom-14 z-40 w-96 bg-sidebar-background border-l border-sidebar-border transition-transform duration-300",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground">{destination.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{destination.tagline}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Quote */}
            {destination.quote && (
              <div className="bg-gradient-glass backdrop-blur-sm rounded-lg p-4 border border-sidebar-border">
                <Quote className="h-4 w-4 text-primary mb-2" />
                <p className="text-sm italic text-sidebar-foreground">"{destination.quote.text}"</p>
                <p className="text-xs text-muted-foreground mt-2">— {destination.quote.author}</p>
              </div>
            )}

            {/* Stats */}
            {destination.stats && (
              <div className="grid grid-cols-3 gap-2">
                {destination.stats.visitors && (
                  <div className="bg-surface-elevated rounded-lg p-3 text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Visitors</p>
                    <p className="text-sm font-semibold">{destination.stats.visitors}</p>
                  </div>
                )}
                {destination.stats.rating && (
                  <div className="bg-surface-elevated rounded-lg p-3 text-center">
                    <MapPin className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-sm font-semibold">{destination.stats.rating}/5</p>
                  </div>
                )}
                {destination.stats.temperature && (
                  <div className="bg-surface-elevated rounded-lg p-3 text-center">
                    <Thermometer className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Temp</p>
                    <p className="text-sm font-semibold">{destination.stats.temperature}</p>
                  </div>
                )}
              </div>
            )}

            <Separator className="bg-sidebar-border" />

            {/* AI Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-sidebar-foreground mb-2">Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {destination.aiContent.overview}
                </p>
              </div>

              {destination.aiContent.history && (
                <div>
                  <h3 className="text-sm font-semibold text-sidebar-foreground mb-2">History</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {destination.aiContent.history}
                  </p>
                </div>
              )}

              {destination.aiContent.culture && (
                <div>
                  <h3 className="text-sm font-semibold text-sidebar-foreground mb-2">Culture</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {destination.aiContent.culture}
                  </p>
                </div>
              )}

              {destination.aiContent.attractions && (
                <div>
                  <h3 className="text-sm font-semibold text-sidebar-foreground mb-2">Top Attractions</h3>
                  <ul className="space-y-1">
                    {destination.aiContent.attractions.map((attraction, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {attraction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {destination.aiContent.bestTimeToVisit && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Best Time to Visit</p>
                    <p className="text-sm font-medium">{destination.aiContent.bestTimeToVisit}</p>
                  </div>
                </div>
              )}

              {destination.aiContent.tips && (
                <div>
                  <h3 className="text-sm font-semibold text-sidebar-foreground mb-2">Travel Tips</h3>
                  <ul className="space-y-1">
                    {destination.aiContent.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full mt-1.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Separator className="bg-sidebar-border" />

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-sidebar-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button className="w-full bg-primary hover:bg-primary/90 shadow-glow" asChild>
              <a href={destination.cta.link} target="_blank" rel="noopener noreferrer">
                {destination.cta.text}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}