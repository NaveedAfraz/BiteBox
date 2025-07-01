import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import CardComponent from "@/components/CardComponent";
const About = () => {
  const teamMembers = [
    {
      Name: "Syed Naveed Afraz",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      role: "Full Stack Developer",
      description: "Naveed is behind the idea of BiteBox. He is responsible for the technology and infrastructure of the company.",
    },
  ];


  const Values = [
    {
      Name: "Customer Obsession",
      desc: "We start with the customer and work backwards.",
      img:
        "https://images.unsplash.com/photo-1496115965489-21be7e6e59a0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      Name: "Quality First",
      desc: "We ensure the quality of our food and service.",
      img:
        "https://images.unsplash.com/photo-1623461317265-4bec46efb4d8?q=80&w=745&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      Name: "Simplicity",
      desc: "We believe in making things simple and intuitive.",
      img:
        "https://plus.unsplash.com/premium_photo-1666739031977-02b2f406f356?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      Name: "Ownership",
      desc: "We take ownership of our work and our customers.",
      img: "https://images.unsplash.com/photo-1658619624873-48916dd506a0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    }
  ];


  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-grow pt-24 ">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-3 py-1 mb-8 text-xs font-medium uppercase tracking-wider text-blue-600 bg-blue-100 rounded-full">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              Redefining The Food Experience
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
              We transform how you discover and enjoy food.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-blue-500 text-white rounded-full px-8 py-4" onClick={() => navigate("/menu")}>
                Our Menu
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 rounded-full px-8 py-4"
                onClick={() => navigate("/contact")}
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
          <div className="mx-auto w-[90%]">
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

            </h2>

            <div className="flex flex-wrap justify-center items-center  ">
              <CardComponent teamMembers={teamMembers} title="The People Behind BiteBox" />
            </div>
            {/* <p className="max-w-2xl mx-auto text-gray-600 mb-10">
              Our diverse team brings expertise in technology, design, and
              culinary arts.
            </p> */}
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
