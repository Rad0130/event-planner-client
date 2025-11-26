"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Calendar, DollarSign, Filter, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Event {
  _id: string;
  title: string;
  shortDescription: string;
  price: number;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  image: string;
}

const EventCard = ({ event }: { event: Event }) => (
  <div className="event-card bg-white flex flex-col h-full">
    <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
      <img src={event.image} alt={event.title} className="object-cover w-full h-full" loading="lazy" />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="font-bold text-xl mb-2 line-clamp-1">{event.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{event.shortDescription}</p>
      
      <div className="flex justify-between items-center text-sm mb-4">
        <div className="flex items-center text-indigo-600 font-semibold">
          <DollarSign size={16} className="mr-1" /> {formatCurrency(event.price)}
        </div>
        <div className="flex items-center text-gray-500">
          <Calendar size={16} className="mr-1" /> {event.date}
        </div>
      </div>
      
      <Link
        href={`/events/${event._id}`}
        className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/events`);
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = selectedPriority === "All" || event.priority === selectedPriority;
      
      const matchesPrice = priceRange === "All" || 
                          (priceRange === "0-500" && event.price <= 500) ||
                          (priceRange === "500-1000" && event.price > 500 && event.price <= 1000) ||
                          (priceRange === "1000+" && event.price > 1000);
      
      return matchesSearch && matchesPriority && matchesPrice;
    });
  }, [events, searchTerm, selectedPriority, priceRange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mr-3" />
          <span className="text-gray-600">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-2">Event Portfolio</h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore our wide range of services and successful event packages.
      </p>

      {/* Search & Filter UI */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 p-6 bg-white rounded-xl shadow-md">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="w-full md:w-48">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="All">All Prices</option>
            <option value="0-500">$0 - $500</option>
            <option value="500-1000">$500 - $1000</option>
            <option value="1000+">$1000+</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || selectedPriority !== "All" || priceRange !== "All") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedPriority("All");
              setPriceRange("All");
            }}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </p>
        {(searchTerm || selectedPriority !== "All" || priceRange !== "All") && (
          <p className="text-sm text-gray-500">
            Filtered results
          </p>
        )}
      </div>

      {/* Event Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16">
            <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedPriority("All");
                setPriceRange("All");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}