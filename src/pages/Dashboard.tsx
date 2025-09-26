import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { mockComplaints } from '@/lib/mock-data';
import { FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '@/types/complaint';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Calculate statistics
  const stats: DashboardStats = {
    total: mockComplaints.length,
    pending: mockComplaints.filter(c => c.status === 'pending').length,
    inProgress: mockComplaints.filter(c => c.status === 'in-progress').length,
    resolved: mockComplaints.filter(c => c.status === 'resolved').length,
  };

  // Get recent pending complaints
  const recentPending = mockComplaints
    .filter(c => c.status === 'pending')
    .sort((a, b) => b.dateSubmitted.getTime() - a.dateSubmitted.getTime())
    .slice(0, 5);

  const statCards = [
    { 
      title: 'Total Complaints', 
      value: stats.total, 
      icon: FileText, 
      color: 'text-primary',
      bgColor: 'bg-primary-light'
    },
    { 
      title: 'Pending Complaints', 
      value: stats.pending, 
      icon: AlertCircle, 
      color: 'text-status-pending',
      bgColor: 'bg-status-pending-light'
    },
    { 
      title: 'In Progress', 
      value: stats.inProgress, 
      icon: Clock, 
      color: 'text-status-progress',
      bgColor: 'bg-status-progress-light'
    },
    { 
      title: 'Resolved', 
      value: stats.resolved, 
      icon: CheckCircle, 
      color: 'text-status-resolved',
      bgColor: 'bg-status-resolved-light'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of system complaints and status</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Pending Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pending Complaints</CardTitle>
          <p className="text-sm text-muted-foreground">
            Requires immediate attention
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPending.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending complaints at the moment
              </p>
            ) : (
              recentPending.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{complaint.title}</h3>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{complaint.location}</span>
                      <span>•</span>
                      <span>
                        {complaint.dateSubmitted.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {complaint.submitter.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}