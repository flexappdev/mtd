import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star } from 'lucide-react';
import { Destination } from '@/types/destination';

interface DestinationTilesProps {
  destinations: Destination[];
  onDestinationClick: (destination: Destination) => void;
}

export function DestinationTiles({ destinations, onDestinationClick }: DestinationTilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {destinations.map((destination) => (
        <Card
          key={destination.id}
          className="group cursor-pointer overflow-hidden bg-card hover:shadow-xl transition-all duration-300 border-border"
          onClick={() => onDestinationClick(destination)}
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${destination.images[0] || '/placeholder.jpg'})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Type Badge */}
            <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
              {destination.type}
            </Badge>

            {/* Stats */}
            {destination.stats?.rating && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white">{destination.stats.rating}</span>
              </div>
            )}
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Title and Tagline */}
            <div>
              <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
                {destination.title}
              </h3>
              <p className="text-sm text-muted-foreground">{destination.tagline}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {destination.description}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {destination.stats?.visitors && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{destination.stats.visitors}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{destination.category[0]}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {destination.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}