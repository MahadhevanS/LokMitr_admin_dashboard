import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { mockComplaints, mockDepartments } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, User, Mail, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { ComplaintStatus } from '@/types/complaint';

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminName } = useAuth();
  const { toast } = useToast();
  
  const complaint = mockComplaints.find(c => c.id === id);
  
  const [status, setStatus] = useState<ComplaintStatus>(complaint?.status || 'pending');
  const [department, setDepartment] = useState(complaint?.assignedDepartment || '');

  if (!complaint) {
    return (
      <div className="p-6">
        <p>Complaint not found</p>
      </div>
    );
  }

  const handleSave = () => {
    // In production, this would update the database
    toast({
      title: 'Changes saved',
      description: 'Complaint details have been updated successfully',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/complaints')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Complaints
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Complaint Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo Evidence */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Photo Evidence</h3>
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              {/* Issue Details */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Issue Title</h3>
                <p className="font-medium text-lg">{complaint.title}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-foreground">{complaint.description}</p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{complaint.location}</span>
                </div>
                {/* Map placeholder */}
                <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">Map View</p>
                </div>
              </div>

              {/* Submitter Details */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Submitter Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{complaint.submitter.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{complaint.submitter.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Submitted on {complaint.dateSubmitted.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Admin Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Status */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Status</h3>
                <StatusBadge status={complaint.status} />
              </div>

              {/* Update Status */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h3>
                <Select value={status} onValueChange={(value) => setStatus(value as ComplaintStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assign Department */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Assign Department</h3>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Action History */}
          <Card>
            <CardHeader>
              <CardTitle>Action History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complaint.actionHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No actions taken yet</p>
                ) : (
                  complaint.actionHistory.map((action) => (
                    <div key={action.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{action.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {action.timestamp.toLocaleDateString()} at {action.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">by {action.adminName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}