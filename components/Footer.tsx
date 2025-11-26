import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Section 1: Event Planner */}
          <div>
            <h3 className="text-xl font-bold text-indigo-400 mb-4">EventPlanner</h3>
            <p className="text-gray-400 text-sm">Crafting unforgettable experiences with style and precision.</p>
          </div>
          
          {/* Section 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-indigo-300 transition">Home</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-indigo-300 transition">Events</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-indigo-300 transition">Services</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-indigo-300 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Section 3: Admin */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Admin Panel</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-gray-400 hover:text-indigo-300 transition">Login</Link></li>
              <li><Link href="/dashboard/add-event" className="text-gray-400 hover:text-indigo-300 transition">Add Event</Link></li>
              <li><Link href="/dashboard/manage-events" className="text-gray-400 hover:text-indigo-300 transition">Manage Events</Link></li>
            </ul>
          </div>
          
          {/* Section 4: Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-indigo-300 transition"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-indigo-300 transition"><Instagram size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-indigo-300 transition"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EventPlanner Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}