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
import useAddresses from "@/hooks/Restaurant/useRestaurant";
import { Input } from "../ui/input";
import useRestaurant from "@/hooks/Restaurant/useRestaurant";

function RoleSelectionModal({ isOpen, onRoleSelect, setIsModalOpen }) {
  const [selectedRole, setSelectedRole] = useState("");
  const { signUp, setActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { Add_Adresses } = useRestaurant();
  const { signupAuth } = useAuth();

  const { user } = useUser();
  const [showInputs, setShowInputs] = useState(false);
  const [formData, setFormData] = useState({
    country: "US",
    city: "",
    street: "",
    building: "",
    postalCode: "",
    additionalInfo: "",
    addressType: "",
  });

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // Restaurant data state
  const [restaurantData, setRestaurantData] = useState({
    Name: "",
    PhoneNumber: "",
    Cuisine: "",
    Description: "",
    OpeningHours: "",
    ClosingHours: "",
    ImageUrl: "", // Store the uploaded image URL here
  });

  // Cloudinary constants - these should be defined in an environment variable in production
  const CLOUD_NAME = 'dvntoejlv';
  const UPLOAD_PRESET = 'bitebox_menu_items';

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return null;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      setUploadStatus('Uploading image...');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      );

      const result = await response.json();
      if (result.secure_url) {
        setImageUrl(result.secure_url);
        // Update restaurant data with the image URL
        setRestaurantData({
          ...restaurantData,
          ImageUrl: result.secure_url
        });
        setUploadStatus('Image uploaded successfully!');
        return result.secure_url;
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Failed to upload image.');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (selectedRole && !showInputs) {
      const formData = {
        email: user.primaryEmailAddress.emailAddress,
        password: user.password,
        role: selectedRole,
        username: user.fullName ? user.fullName : user.lastName || user.primaryEmailAddress.emailAddress || user.firstName || "no name",
      };
      onRoleSelect(selectedRole);
      console.log(formData);
      setShowInputs(true);
      signupAuth.mutate({ formData });
    }
    else {
      // If image file exists and hasn't been uploaded yet, upload it first
      if (imageFile && !imageUrl) {
        const uploadedImageUrl = await handleImageUpload(imageFile);
        if (uploadedImageUrl) {
          // Image uploaded successfully, proceed with form submission
          submitFormWithImage(uploadedImageUrl);
        }
      } else {
        // No image to upload or image already uploaded, proceed with form submission
        submitFormWithImage(imageUrl);
      }
    }
  };

  // Helper function to submit the form with the image URL
  const submitFormWithImage = (imageUrl) => {
    const finalRestaurantData = {
      ...restaurantData,
      ImageUrl: imageUrl || restaurantData.ImageUrl
    };

    console.log("Submitting with restaurant data:", finalRestaurantData);

    Add_Adresses.mutate(
      {
        formData: {
          ...formData,
          role: user.unsafeMetadata.role,
          email: user.primaryEmailAddress.emailAddress,
          username: user.fullName ? user.fullName : user.lastName || user.primaryEmailAddress.emailAddress || user.firstName || "no name"
        },
        restaurantData: finalRestaurantData
      },
      {
        onSuccess: () => {
          // Handle success - close modal
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error("Error submitting data:", error);
        }
      }
    );
  };

  const handleNext = () => {
    setShowInputs(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRestaurantChange = (e) => {
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
          </div>
        )}

        {showInputs && (
          <div className="max-w-md w-full mx-auto space-y-4 p-4 border rounded-lg shadow">
            <h1 className="font-bold text-lg">Restaurant Details</h1>

            {/* Restaurant fields */}
            {Object.keys(restaurantData)
              .filter(field => field !== "ImageUrl") // Don't show ImageUrl field as an input
              .map((field) => (
                <div key={field} className="mb-2">
                  <label className="block text-sm font-medium mb-1">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <Input
                    name={field}
                    value={restaurantData[field]}
                    onChange={handleRestaurantChange}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                    className="w-full"
                  />
                </div>
              ))}

            {/* Image upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Restaurant Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border p-2 rounded"
              />
              {imageFile && !imageUrl && (
                <Button
                  onClick={() => handleImageUpload(imageFile)}
                  className="mt-2"
                  variant="outline"
                  size="sm"
                >
                  Upload Image
                </Button>
              )}
              {uploadStatus && <p className="text-sm mt-1">{uploadStatus}</p>}
              {imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">Image uploaded successfully!</p>
                  <img
                    src={imageUrl}
                    alt="Restaurant preview"
                    className="mt-2 max-h-40 rounded border"
                  />
                </div>
              )}
            </div>

            {/* Address section */}
            <div className="mt-6">
              <h1 className="font-bold text-lg mb-2">Address</h1>
              {Object.keys(formData).map((field) => (
                <div key={field} className="mb-2">
                  <label className="block text-sm font-medium mb-1">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <Input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                    className="w-full"
                  />
                </div>
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
            <Button onClick={handleSubmit}>
              {imageFile && !imageUrl ? "Upload Image & Submit" : "Submit"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoleSelectionModal;