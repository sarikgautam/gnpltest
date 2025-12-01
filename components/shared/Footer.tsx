export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* FLEX CONTAINER */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          
          {/* LEFT SIDE — GNPL */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <img 
              src="/gnpl.jpg"  // Replace with your actual path
              alt="GNPL Logo"
              className="w-20 h-20 object-contain rounded-full border border-gray-700"
            />

            {/* Info */}
            <div>
              <h3 className="text-xl font-bold text-white">GNPL</h3>

              <p className="text-gray-400 text-sm mt-1">Gold Coast Nepalese Premier League</p>
              <p className="text-gray-400 text-sm">Email: gnplinfo@gmail.com</p>
              <p className="text-gray-400 text-sm">Phone: +61 470 000 000</p>
              <p className="text-gray-400 text-sm">Location: Gold Coast, Australia</p>

              <div className="mt-3">
                <a
                  href="/contact"
                  className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-4 py-2 rounded-full"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block h-28 w-[1px] bg-white/20"></div>

          {/* RIGHT SIDE — GORKHAS CC */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <img 
              src="/gcgcc.jpg" // Replace with actual path
              alt="Gorkhas Cricket Club"
              className="w-20 h-20 object-contain rounded-full border border-gray-700"
            />

            {/* Info */}
            <div>
              <h3 className="text-xl font-bold text-white">Gold Coast Gorkhas CC</h3>

              <p className="text-gray-400 text-sm mt-1">
                Community, Cricket, Brotherhood
              </p>
              <p className="text-gray-400 text-sm">Email: info@goldcoastgorkhas.com.au</p>
              <p className="text-gray-400 text-sm">Phone: +61 480 111 222</p>
              <p className="text-gray-400 text-sm">Gold Coast, Australia</p>

              <div className="mt-3">
                <a
                  href="https://goldcoastgorkhas.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-4 py-2 rounded-full"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} GNPL • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
