"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      
      // Close mobile menu if clicking outside
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close mobile menu when route changes - using a ref to avoid direct state update in effect
  useEffect(() => {
    const handleRouteChange = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    handleRouteChange();
  }, [pathname, isOpen]); // Only run when pathname or isOpen changes

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const isActiveRoute = (route: string) => {
    return pathname === route;
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              EventPlanner
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 font-medium transition-colors ${
                  isActiveRoute(link.href)
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                {link.label}
                {isActiveRoute(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
                )}
              </Link>
            ))}
            
            {/* User Menu */}
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center space-x-2 text-gray-700 focus:outline-none hover:text-indigo-600 transition-colors"
                  onClick={handleUserMenuToggle}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <User size={20} />
                  </div>
                  <span className="font-medium max-w-32 truncate">
                    {session.user?.name || session.user?.email}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    <Link 
                      href="/dashboard/add-event" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>Add Event</span>
                    </Link>
                    <Link 
                      href="/dashboard/manage-events" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>Manage Events</span>
                    </Link>
                    <Link 
                      href="/dashboard/my-bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/register" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Register
                </Link>
                <Link 
                  href="/login" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div 
          className="md:hidden bg-white border-b shadow-lg fixed top-16 left-0 right-0 bottom-0 z-40 overflow-y-auto"
          ref={mobileMenuRef}
        >
          <div className="px-4 py-3 space-y-1">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActiveRoute(link.href)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
                onClick={handleMobileLinkClick}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            {session ? (
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    Welcome, {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
                
                <Link 
                  href="/dashboard/add-event" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  Add Event
                </Link>
                <Link 
                  href="/dashboard/manage-events" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  Manage Events
                </Link>
                <Link 
                  href="/dashboard/my-bookings" 
                  className="block py-2 text-gray-700 hover:text-indigo-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  My Bookings
                </Link>
                
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                <Link 
                  href="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  Register
                </Link>
                <Link 
                  href="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}