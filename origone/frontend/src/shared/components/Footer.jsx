import React from "react";

const Footer = () => {
  return (
    <div className="bg-black text-white px-6 md:px-20 py-16">
      <div className="grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <h1 className="text-2xl mb-4">ORgone.</h1>
          <p className="text-gray-400">
            Minimal fashion for modern generation.
          </p>
        </div>

        <div>
          <p className="mb-3 font-medium">Shop</p>
          <p className="text-gray-400">Men</p>
          <p className="text-gray-400">Women</p>
          <p className="text-gray-400">New Arrivals</p>
        </div>

        <div>
          <p className="mb-3 font-medium">Company</p>
          <p className="text-gray-400">About</p>
          <p className="text-gray-400">Careers</p>
          <p className="text-gray-400">Contact</p>
        </div>

        <div>
          <p className="mb-3 font-medium">Stay Updated</p>
          <input
            placeholder="Enter email"
            className="w-full px-3 py-2 bg-white text-black outline-none"
          />
        </div>
      </div>

      <div className="mt-12 text-gray-500 text-xs">
        © 2026 ORgone. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
