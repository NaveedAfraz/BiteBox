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
import { useSignUp, useSignIn, useUser, useClerk } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";
import useAddresses from "@/hooks/Restaurant/useAddress";
import { Input } from "../ui/input";

function RoleSelectionModal({ isOpen, onRoleSelect, setIsModalOpen }) {
  const [selectedRole, setSelectedRole] = useState("");
  const { signUp, setActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { Add_Adresses } = useAddresses();
  const { signupAuth } = useAuth()
  const { user } = useUser()
  const [showInputs, setShowInputs] = useState(false);

  const [formData, setFormData] = useState({
    city: "",
    street: "",
    building: "",
    postalCode: "",
    additionalInfo: "",
    addressType: "",
  });

  const [restaurantData, setRestaurantData] = useState({
    Name: "",
    PhoneNumber: "",
    Cuisine: "",
    Description: "",
    OpeningHours: "",
    ClosingHours: "",
  })


  const handleSubmit = async () => {
    if (selectedRole && !showInputs) {
      const formData = {
        email: user.primaryEmailAddress.emailAddress,
        password: user.password,
        role: selectedRole,
      };
      onRoleSelect(selectedRole);
      console.log(formData);
      setShowInputs(true)
      signupAuth.mutate({ formData })
    }
    else {
      console.log(selectedRole);
      const res = Add_Adresses.mutate(
        { formData: { ...formData, role: user.unsafeMetadata.role, email: user.primaryEmailAddress.emailAddress }, restaurantData: restaurantData },
      )
      console.log(res);
      // toast here
      setIsModalOpen(false)
    }
  };
  // console.log("ruunning");
  // console.log(isOpen);
  const handleNext = () => {
    setShowInputs(true);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRestruentChange = (e) => {
    setRestaurantData({ ...restaurantData, [e.target.name]: e.target.value });
  };
  return (
    <Dialog open={isOpen} onClose={() => onRoleSelect("")}>
      <DialogContent className="sm:max-w-lg sm:w-full">
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Please choose your account type to continue. This selection cannot be changed later.
          </DialogDescription>
        </DialogHeader>

        {/* Role Selection Dropdown */}
        {!showInputs && (
          <>
            <div className="py-3">
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
            </div></>
        )}

        {showInputs && (
          <div className="max-w-md w-full mx-auto space-y-2 p-4 border rounded-lg shadow">
            <h1 className="font-bold">Restaurant Details</h1>
            {Object.keys(restaurantData).map((field) => {
              return (
                <Input
                  key={field}
                  name={field}
                  value={restaurantData[field]}
                  onChange={handleRestruentChange}
                  placeholder={`Enter ${field}`}
                  className="w-full" >
                </Input>
              )
            })}
            <div>
              <h1 className="font-bold">Address</h1>
              {Object.keys(formData).map((field) => (
                <Input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {!showInputs ? (
            <>
              <Button onClick={handleSubmit} disabled={!selectedRole}>
                Confirm Role
              </Button>
              {signupAuth.isSuccess && <Button onClick={handleNext}>Next</Button>}
            </>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoleSelectionModal;
