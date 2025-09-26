import { Complaint, User, Department } from '@/types/complaint';

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP001',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the intersection with 5th Avenue. Multiple vehicles have been damaged.',
    location: '123 Main Street, Downtown',
    latitude: 40.7128,
    longitude: -74.0060,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800',
    status: 'pending',
    dateSubmitted: new Date('2024-01-15T10:30:00'),
    submitter: {
      name: 'John Doe',
      email: 'john.doe@email.com'
    },
    actionHistory: []
  },
  {
    id: 'CMP002',
    title: 'Street Light Not Working',
    description: 'Street light has been out for two weeks. Area is very dark at night and poses safety concerns.',
    location: '456 Oak Avenue, West District',
    latitude: 40.7260,
    longitude: -73.9897,
    imageUrl: 'https://images.unsplash.com/photo-1555861496-0666c8981751?w=800',
    status: 'in-progress',
    dateSubmitted: new Date('2024-01-14T15:45:00'),
    assignedDepartment: 'Electrical',
    submitter: {
      name: 'Jane Smith',
      email: 'jane.smith@email.com'
    },
    actionHistory: [
      {
        id: 'ACT001',
        action: 'Status changed to In Progress',
        timestamp: new Date('2024-01-15T09:00:00'),
        adminName: 'Admin User'
      }
    ]
  },
  {
    id: 'CMP003',
    title: 'Water Leak on Park Road',
    description: 'Significant water leak from underground pipe. Water pooling on street.',
    location: '789 Park Road, North Side',
    latitude: 40.7489,
    longitude: -73.9680,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800',
    status: 'resolved',
    dateSubmitted: new Date('2024-01-12T08:20:00'),
    assignedDepartment: 'Water Supply',
    submitter: {
      name: 'Mike Johnson',
      email: 'mike.j@email.com'
    },
    actionHistory: [
      {
        id: 'ACT002',
        action: 'Status changed to In Progress',
        timestamp: new Date('2024-01-12T10:00:00'),
        adminName: 'Admin User'
      },
      {
        id: 'ACT003',
        action: 'Status changed to Resolved',
        timestamp: new Date('2024-01-13T14:30:00'),
        adminName: 'Admin User'
      }
    ]
  },
  {
    id: 'CMP004',
    title: 'Graffiti on Public Building',
    description: 'Extensive graffiti on the side of the community center needs removal.',
    location: '321 Community Center Drive',
    latitude: 40.7580,
    longitude: -73.9855,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    status: 'pending',
    dateSubmitted: new Date('2024-01-16T11:00:00'),
    submitter: {
      name: 'Sarah Williams',
      email: 'sarah.w@email.com'
    },
    actionHistory: []
  },
  {
    id: 'CMP005',
    title: 'Broken Sidewalk',
    description: 'Cracked and uneven sidewalk section creating trip hazard.',
    location: '555 Elm Street, East End',
    latitude: 40.7305,
    longitude: -74.0089,
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
    status: 'in-progress',
    dateSubmitted: new Date('2024-01-13T14:15:00'),
    assignedDepartment: 'Public Works',
    submitter: {
      name: 'Robert Brown',
      email: 'robert.b@email.com'
    },
    actionHistory: [
      {
        id: 'ACT004',
        action: 'Status changed to In Progress',
        timestamp: new Date('2024-01-14T08:00:00'),
        adminName: 'Admin User'
      }
    ]
  }
];

export const mockUsers: User[] = [
  { id: 'USR001', name: 'John Doe', email: 'john.doe@email.com', totalComplaints: 5, rewardPoints: 150, isActive: true },
  { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@email.com', totalComplaints: 3, rewardPoints: 90, isActive: true },
  { id: 'USR003', name: 'Mike Johnson', email: 'mike.j@email.com', totalComplaints: 8, rewardPoints: 240, isActive: true },
  { id: 'USR004', name: 'Sarah Williams', email: 'sarah.w@email.com', totalComplaints: 2, rewardPoints: 60, isActive: true },
  { id: 'USR005', name: 'Robert Brown', email: 'robert.b@email.com', totalComplaints: 4, rewardPoints: 120, isActive: true },
];

export const mockDepartments: Department[] = [
  { id: 'DEPT001', name: 'Public Works', description: 'Handles roads, sidewalks, and general infrastructure' },
  { id: 'DEPT002', name: 'Water Supply', description: 'Manages water infrastructure and leaks' },
  { id: 'DEPT003', name: 'Electrical', description: 'Responsible for street lights and electrical infrastructure' },
  { id: 'DEPT004', name: 'Parks & Recreation', description: 'Maintains public parks and recreational facilities' },
  { id: 'DEPT005', name: 'Sanitation', description: 'Handles waste management and cleanliness' },
];