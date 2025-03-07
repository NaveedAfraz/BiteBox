import React from "react";
import { FacebookIcon, TwitterIcon, InstagramIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      {/* Main Container */}
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Brand / Logo */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">BiteBox</h2>
            <p className="text-gray-400 text-sm">
              Delivering delicious meals at your doorstep
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <a href="#" className="hover:text-amber-400 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Menu
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Social Icons */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400 mb-2">Follow us on</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-amber-400 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-amber-400 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-amber-400 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BiteBox. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
