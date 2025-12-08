import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Package, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminOverview() {
  // Mock data - replace with real data from your API
  const stats = [
    { title: 'Total Bookings', value: '1,234', icon: Calendar, trend: '+12%', trendPositive: true },
    { title: 'Total Revenue', value: '$45,231', icon: CreditCard, trend: '+19%', trendPositive: true },
    { title: 'Active Dahabiyas', value: '24', icon: Package, trend: '+2', trendPositive: true },
    { title: 'New Customers', value: '183', icon: Users, trend: '+12', trendPositive: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trendPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-egyptian-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-egyptian-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    #BK-{Math.floor(1000 + Math.random() * 9000)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Add New Dahabiya
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Create New Package
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                View All Bookings
              </button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Luxury Dahabiya Cruise</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {2 + i} guests
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
