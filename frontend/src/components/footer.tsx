//Andrew
import React from "react";

const FooterContainer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>© 2026 Vendor Venues. All rights reserved.</div>
          <div className="flex space-x-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterContainer;