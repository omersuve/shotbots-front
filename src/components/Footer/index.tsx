import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-gray-800 py-3 opacity-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="md:mb-0 text-center">
            <h5 className="text-lg font-bold">Shot Bots</h5>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Shot Bots. All rights reserved.
            </p>
          </div>
          <div className="hidden lg:flex lg:space-x-4 text-base">
            <div className="hover:text-gray-400">
              <Link href="https://docs.shotbots.app/" target="_blank">
                Docs
              </Link>
            </div>
            <div className="pointer-events-none hover:text-gray-400">
              Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
