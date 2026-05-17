import { ArrowLeft, User, Mail, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Account = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Account</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback>TU</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Travel User</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">traveler@example.com</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Morocco Explorer</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Member since 2025</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Stats</CardTitle>
              <CardDescription>Your Morocco exploration progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-surface-elevated rounded-lg">
                  <div className="text-3xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Destinations Visited</div>
                </div>
                <div className="text-center p-4 bg-surface-elevated rounded-lg">
                  <div className="text-3xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Photos Shared</div>
                </div>
                <div className="text-center p-4 bg-surface-elevated rounded-lg">
                  <div className="text-3xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Reviews Written</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorite Destinations</CardTitle>
              <CardDescription>Places you've bookmarked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Marrakech', 'Chefchaouen', 'Sahara Desert'].map((destination) => (
                  <div key={destination} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                    <span className="font-medium">{destination}</span>
                    <Badge variant="secondary">Visited</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">Edit Profile</Button>
              <Button variant="outline" className="w-full">Change Password</Button>
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;