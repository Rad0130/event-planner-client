// UPDATED app/events/page.tsx (Implementing Server-Side Data Fetching)

import Link from "next/link";
import { Search, Calendar, DollarSign } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface Event {
    _id: string;
    title: string;
    shortDescription: string;
    price: number;
    date: string;
    priority: 'High' | 'Medium' | 'Low';
    image: string;
}

// --------------------------------------------------------
// DATA FETCHING: Replaced mock data with API call
// --------------------------------------------------------
async function getEvents(): Promise<Event[]> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Fetch data from the backend
    const res = await fetch(`${API_URL}/events`, { 
        cache: 'no-store' 
    });
    
    if (!res.ok) {
        console.error("Failed to fetch all events:", res.status);
        return [];
    }
    
    return res.json();
}

// EventCard component (No changes needed)
const EventCard = ({ event }: { event: Event }) => (
    // ... (EventCard implementation from previous step) ...
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


export default async function EventsPage() {
    const events = await getEvents(); // <-- Fetch all events here

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold mb-2">Event Portfolio</h1>
            <p className="text-lg text-gray-600 mb-8">
                Explore our wide range of services and successful event packages.
            </p>

            {/* Search & Filter UI (Unchanged) */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
                {/* ... Search and Filter Inputs ... */}
            </div>

            {/* Event Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))
                ) : (
                    <p className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-gray-500 py-10 text-lg">
                        No events found. Please check your backend API status.
                    </p>
                )}
            </div>
        </div>
    );
}