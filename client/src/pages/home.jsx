import React from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  categories,
  bestSellers,
  specialOffers,
  testimonials,
} from "@/config/details";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import CardComponent from "@/components/CardComponent";
import SpecialCard from "@/components/SpecialCard";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
function Home() {
  //console.log(specialOffers);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <div
          className="absolute inset-0 bg-cover z-[0] w-[95%] bg-center bg-no-repeat blur-xl opacity-40 "
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3')",
            transform: "scale(1.1)",
          }}
        />

        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[-1]"></div>
        <div className="w-full  h-[100vh] z-10 flex flex-col pt-50 items-center lg:flex-row ">
          <div className="w-full flex flex-col h-[50vh]  lg:flex-row ">
            <div className="flex-1 lg:pr-8 text-center lg:text-left h-[50vh]  flex flex-col justify-center items-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-center pb-5 text-gray-800 mb-4">
                Delicious Food Delivered To Your Doorstep
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Order your favorite meals from the best restaurants in town
              </p>
              <div className="flex gap-4 max-w-xl w-full mx-auto md:mx-0">
                <Input
                  type="text"
                  placeholder="Search for food or restaurants..."
                  className="flex-1 px-4 py-3 p-7 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-colors"
                />
                <button className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="flex-1 mt-8 lg:mt-0 h-[50vh] flex justify-center items-center w-full lg:w-1/2">
              <div className="w-[40vw] h-[40vh] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3"
                  alt="Delicious Food"
                  className="w-full rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="px-5 py-16 bg-white">
          <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            <CardComponent categories={categories} title="Food Categories" />
          </div>
        </div>
      </div>
      <div className="px-5 py-16 bg-white">
        <CardComponent categories={bestSellers} title="Best Sellers" />
      </div>

      <div className="flex flex-col gap-4 justify-center items-center p-10 mt-10 relative">
        <div
          className="absolute inset-0 bg-cover z-[-3] w-[95%] bg-center bg-no-repeat blur-xl opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3')",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-white/500 backdrop-blur-sm z-[-1]"></div>
        <SpecialCard
          offerId="new-user"
          specialOffers={specialOffers}
          title="Special Offers"
        />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center m-2 mt-10 w-[95%] mb-10 ">
        <h1 className="text-2xl font-bold text-center flex justify-center items-center mb-6 mt-10">
          Customer Reviews
        </h1>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-[95%] max-w-2xl lg:max-w-4xl xl:max-w-7xl"
        >
          <CarouselContent className="-ml-2 md:-ml-1">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex justify-center items-center">
                  <Card className="w-64 h-64 xl:w-90 xl:h-90 shadow-lg rounded-lg">
                    <CardContent className="flex items-center justify-center p-5 h-full flex-col">
                      <span className="text-xl font-bold text-gray-800 mb-2">
                        {testimonial.name}
                      </span>
                      <p className="text-sm italic text-gray-700 text-center mb-2">
                        "{testimonial.quote}"
                      </p>
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        🍽️ {testimonial.foodItem}
                      </p>
                      <p className="text-sm text-gray-700">
                        ⭐ {testimonial.rating} / 5
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}

export default Home;
