import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';
import useRestaurant from '@/hooks/Restaurant/useRestaurant';

const UserList = () => {
  const { userInfo } = useSelector(state => state.auth);
  const { getAllUsers, updateUserStatus } = useRestaurant();
  const { data: AllUsers, refetch } = getAllUsers({ userID: userInfo?.userId });
  //console.log(userInfo);
  console.log(AllUsers);

  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');


  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewStatus(user.status || 'active');
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedUser || !newStatus) return;
    try {
      updateUserStatus.mutate(
        {
          userID: selectedUser.userID,
          status: newStatus
        })
      setIsDialogOpen(false);
      setTimeout(() => {
         refetch(); 
        // console.log("heloF");
      }, 1000)

    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

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
              <TableRow key={user.userID}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.userName} />
                    {user.userName ? (
                      <AvatarFallback>
                        {user.userName.split(' ').map(n => n[0].toUpperCase()).join('')}
                      </AvatarFallback>
                    ) : null}
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.userName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status || 'active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Edit User Status</DialogTitle>
          <DialogDescription>
            Update the status for {selectedUser?.userName}
          </DialogDescription>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserList;