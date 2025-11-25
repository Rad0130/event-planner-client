import Link from "next/link";
import { Calendar, CheckCircle, Star, Users } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* 1. Hero Section */}
      <section className="bg-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Plan Unforgettable Events</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">From weddings to corporate conferences, we manage every detail so you do not have to.</p>
        <Link href="/events" className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Browse Events
        </Link>
      </section>

      {/* 2. Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
              <Calendar className="text-indigo-600 mb-4 h-10 w-10" />
              <h3 className="text-xl font-bold mb-2">Seamless Planning</h3>
              <p className="text-gray-600">We handle the logistics, styling, and coordination effortlessly.</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Stats (Visual Break) */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-4xl font-bold text-indigo-400">500+</div><div>Events</div></div>
          <div><div className="text-4xl font-bold text-indigo-400">98%</div><div>Satisfaction</div></div>
          <div><div className="text-4xl font-bold text-indigo-400">50+</div><div>Venues</div></div>
          <div><div className="text-4xl font-bold text-indigo-400">10</div><div>Years Exp.</div></div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-6">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="italic text-gray-600 mb-4">Absolutely the best service provided. The wedding was magical!</p>
            <div className="font-bold">- Sarah J.</div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="italic text-gray-600 mb-4">Professional, timely, and within budget. Highly recommended.</p>
            <div className="font-bold">- Tech Corp.</div>
          </div>
        </div>
      </section>
      
      {/* 5, 6, 7... Additional sections (Gallery, CTA, etc) can go here following similar patterns */}
    </div>
  );
}