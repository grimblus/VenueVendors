//Andrew
import React from "react";

const FooterContainer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
        <div className="w-full flex justify-between items-center">
          <div>© 2026 Vendor Venues. All rights reserved.</div>
          <div className="flex gap-4 ml-auto">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
      </div>
    </footer>
  );
};

export default FooterContainer;