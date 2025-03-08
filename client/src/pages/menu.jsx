import React from "react";
import CardComponent from "../components/CardComponent";
import { categories } from "../config/details";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { filterButtons } from "../config/details";
import { ChevronDown } from "lucide-react";
import MenuComponent from "../components/menuComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
function Menu() {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-grow pt-24 ">
        <div className="container mx-auto px-4 relative">
          <Breadcrumb className="">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/menu">Menu</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-2xl font-bold absolute  top-10 left-10">
            What's cooking for you today ?
          </h1>
          <div className="flex gap-8 overflow-x-auto  scrollbar-hide">
            <CardComponent categories={categories} />
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold ml-10">Top Brands </h1>
            <p className="text-gray-500 ml-10">
              These are the top picks from our chefs
            </p>
          </div>
          <div className="flex gap-8 overflow-x-auto  scrollbar-hide">
            <div className="flex gap-8 ">
              {categories.map((category) => (
                <Card className="w-[300px] h-[400px] flex flex-col items-center justify-center border-0 shadow-lg rounded-lg">
                  <CardHeader>
                    {" "}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-[250px] object-cover rounded-[50%]"
                    />
                    <CardTitle className="text-center mt-4">
                      {category.brand}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <section className="flex flex-col mx-auto px-4 mt-14 mb-10 ml-0 lg:ml-30">
        <div className="flex flex-col px-4 mt-14 mx-auto  w-full mb-10">
          <div className="flex flex-col mb-4">
            <h1 className="text-2xl font-bold">Nearest Restaurants</h1>
            <p className="text-gray-500">
              These are the top picks from our chefs
            </p>
          </div>
          <div className="flex flex-wrap items-center  w-full gap-3.5 p-2">
            {filterButtons.map((button) => (
              <Button key={button.id} className="flex items-center gap-2">
                {button.icon}
                {button.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full ml-10 lg:ml-0">
          {categories.map((menu) => (
            <MenuComponent key={menu.id} menu={menu} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Menu;
