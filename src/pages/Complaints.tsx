import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { mockComplaints } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import { ComplaintStatus } from '@/types/complaint';

export default function Complaints() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusTabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Complaint Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all submitted complaints</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            {/* Status Tabs */}
            <div className="flex gap-2">
              {statusTabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant={statusFilter === tab.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(tab.value as ComplaintStatus | 'all')}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Issue Title</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                  >
                    <td className="py-3 px-4 text-sm font-medium">{complaint.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{complaint.title}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {complaint.location}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {complaint.dateSubmitted.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {complaint.assignedDepartment || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={complaint.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredComplaints.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No complaints found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}