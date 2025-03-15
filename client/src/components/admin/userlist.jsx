import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSelector } from 'react-redux';
import useRestaurant from '@/hooks/Restaurant/useRestaurant';

const UserList = () => {
  // Sample user data - replace with your actual data source
  const users = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Customer", status: "active", avatar: "/api/placeholder/32/32" },
    { id: 2, name: "Michael Chen", email: "michael.c@example.com", role: "Customer", status: "active", avatar: "/api/placeholder/32/32" },
    { id: 3, name: "Aisha Patel", email: "aisha.p@example.com", role: "Restaurant Owner", status: "active", avatar: "/api/placeholder/32/32" },
    { id: 4, name: "Carlos Rodriguez", email: "carlos.r@example.com", role: "Delivery Driver", status: "offline", avatar: "/api/placeholder/32/32" },
    { id: 5, name: "Emma Wilson", email: "emma.w@example.com", role: "Customer", status: "active", avatar: "/api/placeholder/32/32" },
  ];
  const { userInfo } = useSelector(state => state.auth)
  console.log(userInfo);
  const { getAllUsers } = useRestaurant()
  const { data: AllUsers } = getAllUsers({ userID: userInfo.userId })
  console.log(AllUsers);


  return (
    <Card className="w-full h-[80vh] overflow-hidden">
      <CardHeader>
        <CardTitle>BiteBOX Users</CardTitle>
        <CardDescription>Manage all users in your food delivery app</CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-auto h-[80vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AllUsers && AllUsers.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-sm text-blue-600 hover:underline">Edit</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserList;