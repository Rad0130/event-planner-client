"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              EventPlanner
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link href="/events" className="text-gray-700 hover:text-indigo-600">Events</Link>
            <Link href="/services" className="text-gray-700 hover:text-indigo-600">Services</Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600">Contact</Link>
            
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 focus:outline-none">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <User size={20} />
                  </div>
                  <span>{session.user?.name}</span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 w-48 mt-2 bg-white border rounded-md shadow-lg py-2 hidden group-hover:block">
                  <Link href="/dashboard/add-event" className="block px-4 py-2 hover:bg-gray-100">Add Product</Link>
                  <Link href="/dashboard/manage-events" className="block px-4 py-2 hover:bg-gray-100">Manage Products</Link>
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b">
           <Link href="/events" className="block px-4 py-2">Events</Link>
           {session ? (
             <>
               <Link href="/dashboard/add-event" className="block px-4 py-2">Add Event</Link>
               <Link href="/dashboard/manage-events" className="block px-4 py-2">Manage Events</Link>
               <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-red-600">Logout</button>
             </>
           ) : (
             <Link href="/login" className="block px-4 py-2 bg-indigo-50">Login</Link>
           )}
        </div>
      )}
    </nav>
  );
}