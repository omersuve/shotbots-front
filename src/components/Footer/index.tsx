import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-200 text-gray-800 py-3 opacity-50 pointer-events-none">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="md:mb-0 text-center">
                        <h5 className="text-lg font-bold">Shot Bots</h5>
                        <p className="text-sm">&copy; {new Date().getFullYear()} Shot Bots. All rights reserved.</p>
                    </div>
                    <div className="hidden lg:flex lg:space-x-4">
                        <div className="text-sm hover:text-gray-400">About</div>
                        <div className="text-sm hover:text-gray-400">Services</div>
                        <div className="text-sm hover:text-gray-400">Contact</div>
                        <div className="text-sm hover:text-gray-400">Privacy Policy</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
