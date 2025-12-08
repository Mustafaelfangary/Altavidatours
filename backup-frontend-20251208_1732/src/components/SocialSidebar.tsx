"use client";

import Link from "next/link";

export default function SocialSidebar() {
  // Hidden as requested
  // return null;
  return (
    <div className="fixed right-2 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col gap-2">
        {/* Facebook */}
        <Link 
          href="https://facebook.com" 
          className="bg-white/90 backdrop-blur rounded-full p-2 shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </Link>

        {/* Twitter/X */}
        <Link 
          href="https://twitter.com" 
          className="bg-white/90 backdrop-blur rounded-full p-2 shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#000000" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </Link>

        {/* Pinterest */}
        <Link 
          href="https://pinterest.com" 
          className="bg-white/90 backdrop-blur rounded-full p-2 shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#E60023" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.119.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.597 2.291-.744 2.491-.342 1.19-1.28 2.689-1.9 3.601C9.596 23.522 10.794 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        </Link>

        {/* YouTube */}
        <Link 
          href="https://youtube.com" 
          className="bg-white/90 backdrop-blur rounded-full p-2 shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
            <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </Link>

        {/* Instagram */}
        <Link 
          href="https://instagram.com" 
          className="bg-white/90 backdrop-blur rounded-full p-2 shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="ig" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#F58529" />
                <stop offset="50%" stopColor="#DD2A7B" />
                <stop offset="100%" stopColor="#8134AF" />
              </linearGradient>
            </defs>
            <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </Link>

        {/* TripAdvisor */}
        <Link 
          href="https://tripadvisor.com" 
          className="bg-white/90 backdrop-blur rounded-full p-2 shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#34E0A1" d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H1.852c-.439 0-.795.356-.795.795s.356.795.795.795h1.828c-.8 1.067-1.375 2.307-1.699 3.68-.439 1.859-.439 3.825 0 5.684.324 1.373.9 2.613 1.699 3.68H1.852c-.439 0-.795.356-.795.795s.356.795.795.795h2.51c2.307 1.569 4.975 2.353 7.645 2.353s5.338-.784 7.645-2.353h2.51c.439 0 .795-.356.795-.795s-.356-.795-.795-.795h-1.828c.8-1.067 1.375-2.307 1.699-3.68.439-1.859.439-3.825 0-5.684-.324-1.373-.9-2.613-1.699-3.68h1.828c.439 0 .795-.356.795-.795s-.356-.795-.795-.795h-2.51c-2.307-1.569-4.975-2.353-7.645-2.353z"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
