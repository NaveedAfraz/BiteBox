import React, { useActionState, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import useAddress from "@/hooks/Restaurant/useAddress";
import { Trash2 } from "lucide-react";
function Address({ setSelectedAddress, selectedAddress, userid }) {
  const [open, setOpen] = useState(false);
  const [Address, setaddAddress] = useState([]);
  console.log(Address);

  const { fetchAddress, addAddress, removeAddress } = useAddress()

  const { data: address, refetch } = fetchAddress({ userID: userid })
  console.log(Address);
  useEffect(() => {
    if (Array.isArray(address?.data)) {
      setaddAddress(address.data);
    } else {
      setaddAddress([]);
    }
  }, [address])

  console.log(selectedAddress);
  const fields = [
    { label: "Address", name: "address", placeholder: "Address" },
    { name: "country", label: "Country", placeholder: "Enter country" },
    { name: "street", label: "Street", placeholder: "Enter street address" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "state", label: "State", placeholder: "Enter state" },
    { name: "postalCode", label: "Postal Code", placeholder: "Enter Postal code" },
  ];

  const handleSubmit = (prevState, formData) => {
    console.log("dd");

    const formdata = {
      userID: userid,
      addressType: "user",
      address: formData.get("address"),
      country: formData.get('country'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      postalCode: formData.get('postalCode'),
    }
    console.log(formdata);
    const allValuesPresent = Object.values(formdata).every(value => value && value.trim() !== "");
    if (!allValuesPresent) {
      console.log("Some fields are missing.");
      return;
    }
    addAddress.mutate({ addressData: formdata });
    setSelectedAddress(null);
    setTimeout(() => refetch(), 1000)
    setOpen(false);
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null)

  const handleDelete = ({ e, item }) => {
    e.stopPropagation();
    console.log("Delete ", item);
    removeAddress.mutateAsync({ userID: item.userID, addressID: item.addressID });
    setTimeout(() => refetch(), 1000)
  }
  return (
    <div className="w-full max-w-xl z-10 p-2 rounded-t-2xl bg-white md:rounded-l-2xl md:rounded-t-none">
      <CardHeader className="my-2">
        <CardTitle className="text-xl mt-3  font-bold">Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 w-full overflow-y-auto max-h-[250px] md:max-h-[107.2vh]">
          {Address.length > 0 && Address.map((item, index) => (
            <Card
              key={index}
              className={`p-4 w-full border rounded-md ${selectedAddress === item.addressID
                ? "border border-orange-500 bg-orange-100"
                : ""}`}
              onClick={() => setSelectedAddress(item.addressID)}
            >  <p className=" text-sm relative text-gray-600  p-1"><Trash2 className="absolute right-0 cursor-pointer" onClick={(e) => handleDelete({ e, item })}></Trash2></p>
              <div className="space-y-1">
                <p className="font-medium">{item.street}</p>
                <p>{item.city}, {item.country}</p>
                <p>{item.state}, {item.postalCode}</p>
                {item.building && <p>Building: {item.building}</p>}

              </div>
            </Card>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-full" asChild>
            <Button
              className="mt-6 w-full bg-red-500 hover:bg-red-600 cursor-pointer p-6 font-bold"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <form action={formAction}>
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <Input
                      name={field.name}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button className="bg-red-500 cursor-pointer">Save Address</Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent >
    </div >
  );
}

export default Address;
