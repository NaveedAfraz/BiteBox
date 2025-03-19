import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CardComponent from "@/components/CardComponent";
const About = () => {
  const teamMembers = [
    {
      name: "Syed Naveed Afraz",
      image: "https://via.placeholder.com/150",
      role: "Full Stack Developer",
      description:
        "Naveed is the behind the idea of BiteBox. He is responsible for the technology and infrastructure of the company.",
    },
  ];
  const Values = [
    {
      Name: "Customer Obsession",
      desc: "We start with the customer and work backwards.",
      image: "https://via.placeholder.com/150",
    },
    {
      Name: "Quality First",
      desc: "We ensure the quality of our food and service.",
    },
    {
      Name: "Simplicity",
      desc: "We believe in making things simple and intuitive.",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-grow pt-24 ">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-3 py-1 mb-8 text-xs font-medium uppercase tracking-wider text-blue-600 bg-blue-100 rounded-full">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Redefining The Food Experience
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
              We transform how you discover and enjoy food.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-blue-500 text-white rounded-full px-8 py-4">
                Our Menu
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 rounded-full px-8 py-4"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-5 text-xs font-medium uppercase tracking-wider text-blue-600 bg-blue-100 rounded-full">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                From Idea to Your Plate
              </h2>
              <p className="text-gray-600 mb-6">
                BiteBox was born from a simple observation: food delivery can be
                better.
              </p>
              <p className="text-gray-600">
                We focus on elegant simplicity, putting the food experience
                first.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600"
                alt="Food presentation"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 text-center relative">
          <div
            className="absolute inset-0 bg-cover z-[0] w-[95%] bg-center bg-no-repeat blur-xl opacity-40 "
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3')",
              transform: "scale(1.1)",
            }}
          />

          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[-1]"></div>
          <div className="max-w-7xl mx-auto">
            <CardComponent teamMembers={Values} title="Our Values" />
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-3 py-1 mb-5 text-xs font-medium uppercase tracking-wider text-blue-600 bg-blue-100 rounded-full">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The People Behind BiteBox
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-10">
              Our diverse team brings expertise in technology, design, and
              culinary arts.
            </p>

            {/* <div className="p-6 border rounded-lg">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    Image
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Alex Morgan</h3>
                <p className="text-sm text-blue-500 mb-4">Founder & CEO</p>
                <p className="text-gray-600">
                  Alex leads our vision for a better food delivery experience.
                </p>
              </div> */}
            {/* <CardComponent teamMembers={teamMembers} /> */}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-red-600 text-white text-center ">
          <div className="max-w-4xl mx-auto ">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience BiteBox?
            </h2>
            <p className="text-lg mb-10">
              Join thousands of food lovers who've discovered a better way to
              order.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-blue-500 rounded-full px-8 py-4">
                Download App
              </Button>
              <Link to="/menu">
                <Button className="bg-white text-blue-500 rounded-full px-8 py-4 ">
                  Browse Menu
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
