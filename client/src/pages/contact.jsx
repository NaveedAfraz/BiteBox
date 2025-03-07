import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contactDetails } from "@/config/details";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24">
        {/* Contact Info & Form Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600">
                We’d love to hear from you. Reach out with any questions or
                feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Map over contact details */}
              <div className="space-y-8">
                {contactDetails.map((item) => (
                  <Card key={item.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {item.title}
                      </h2>
                      <ul className="space-y-2 text-gray-600">
                        {item.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Right Column: Contact Form */}
              <div>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Send Us a Message
                    </h2>
                    <form className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder="Your Name"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          placeholder="you@example.com"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          placeholder="Subject"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows="5"
                          placeholder="Your Message"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
                        ></textarea>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-md py-3 hover:bg-blue-600"
                      >
                        Submit
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full h-64">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-700 text-xl">Map Placeholder</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
