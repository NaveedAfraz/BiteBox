import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function RoleSelectionModal({ isOpen, onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState("");

  const handleSubmit = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };
  console.log("ruunning");
  console.log(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={() => { /* disable closing by clicking outside */ }}>
      <DialogContent className="sm:max-w-lg sm:w-full">
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Please choose your account type to continue. This selection cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select a role --</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!selectedRole}>
            Confirm Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoleSelectionModal;
