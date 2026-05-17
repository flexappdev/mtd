import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Destination } from '@/types/destination';
import { SortField, SortOrder } from '@/types/destination';

interface DestinationTableProps {
  destinations: Destination[];
  onDestinationClick: (destination: Destination) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export function DestinationTable({
  destinations,
  onDestinationClick,
  sortField,
  sortOrder,
  onSort,
}: DestinationTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="w-[200px]">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 -ml-3"
                onClick={() => onSort('title')}
              >
                Destination
                {getSortIcon('title')}
              </Button>
            </TableHead>
            <TableHead>Tagline</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 -ml-3"
                onClick={() => onSort('type')}
              >
                Type
                {getSortIcon('type')}
              </Button>
            </TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 -ml-3"
                onClick={() => onSort('rating')}
              >
                Rating
                {getSortIcon('rating')}
              </Button>
            </TableHead>
            <TableHead>Visitors</TableHead>
            <TableHead>Temperature</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {destinations.map((destination) => (
            <TableRow
              key={destination.id}
              className="cursor-pointer hover:bg-muted/50 border-border"
              onClick={() => onDestinationClick(destination)}
            >
              <TableCell className="font-medium">{destination.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {destination.tagline}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{destination.type}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {destination.category.slice(0, 2).map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {destination.stats?.rating ? (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{destination.stats.rating}</span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {destination.stats?.visitors || '-'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {destination.stats?.temperature || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}