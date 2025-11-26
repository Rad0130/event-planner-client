// app/page.tsx (FINAL CORRECTED VERSION)
import Link from "next/link";
import { Briefcase, Heart, Sparkles, Star, LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

// --------------------------------------------------------
// 1. Define the Event Interface (for data)
// --------------------------------------------------------
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
// DATA FETCHING: Server Component Fetch
// --------------------------------------------------------
async function getFeaturedEvents(): Promise<Event[]> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    if (!API_URL) {
        // Safe return path if the environment variable is not configured
        console.error("CRITICAL: NEXT_PUBLIC_API_URL is not defined.");
        return [];
    }

    try {
        const res = await fetch(`${API_URL}/events`, { 
            // Ensures fresh data on every request
            cache: 'no-store',
            // Increase timeout or specify signal if the server is slow
            signal: AbortSignal.timeout(5000) 
        });
        
        if (!res.ok) {
            console.error(`Failed to fetch featured events: Status ${res.status}`);
            return [];
        }
        
        const allEvents: Event[] = await res.json();
        // Limit to the first 3 for the showcase section
        return allEvents.slice(0, 3);
    } catch (error) {
        console.error("Error fetching featured events (Is the backend running on port 5000?):", error);
        return [];
    }
}

// --------------------------------------------------------
// 2. Define Props Interfaces (for components)
// --------------------------------------------------------

interface FeatureCardProps {
    icon: LucideIcon; 
    title: string;
    description: string;
}

interface EventCardProps {
    event: Event; 
}


// --------------------------------------------------------
// 3. Components with Specified Types
// --------------------------------------------------------

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:border-indigo-200">
    <Icon className="text-indigo-600 mb-4 h-10 w-10" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const EventCard = ({ event }: EventCardProps) => (
    <div className="event-card bg-white">
        <div className="relative h-48 w-full">
            <img src={event.image} alt={event.title} className="object-cover w-full h-full" loading="lazy" />
        </div>
        <div className="p-5">
            <h3 className="font-bold text-lg mb-1 truncate">{event.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.shortDescription}</p>
            <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-indigo-600">{formatCurrency(event.price)}</span>
                <span className="text-sm text-gray-500">{event.date}</span>
            </div>
            <Link href={`/events/${event._id}`} className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300">
                View Details
            </Link>
        </div>
    </div>
);


export default async function Home() {
  const featuredEvents = await getFeaturedEvents(); 

  return (
    <div className="space-y-24">
      
      {/* 1. Hero Section (Unchanged) */}
      <section className="relative h-[60vh] bg-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')` }}></div>
        <div className="relative z-10 text-white text-center p-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fadeIn">
            Plan Your <span className="text-indigo-400">Perfect Event</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light">
            Seamless event management, from intimate gatherings to grand galas. We handle the details, you make the memories.
          </p>
          <Link href="/events" className="bg-indigo-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-lg">
            Browse Our Services &rarr;
          </Link>
        </div>
      </section>

      {/* 2. Features/Service Highlight Section (Unchanged) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Our Core Services</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard icon={Briefcase} title="Corporate Events" description="Gala dinners, seminars, and trade shows." />
          <FeatureCard icon={Heart} title="Social Celebrations" description="Weddings, birthdays, and anniversaries." />
          <FeatureCard icon={Sparkles} title="Custom Decor" description="Unique, themed setup and professional lighting." />
          <FeatureCard icon={Star} title="Full Coordination" description="End-to-end logistics and vendor management." />
        </div>
      </section>

      {/* 3. Event Showcase Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredEvents.length > 0 ? (
                featuredEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))
            ) : (
                <p className="md:col-span-3 text-center text-gray-500">
                    No featured events found. Please ensure your backend server is running on port 5000.
                </p>
            )}
          </div>
          <div className="text-center mt-12">
            <Link href="/events" className="text-indigo-600 font-semibold hover:text-indigo-800 transition">
                View All Events &rarr;
            </Link>
          </div>
        </div>
      </section>
      
      {/* 4. Testimonials Section (Placeholder) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16">
          <h2 className="text-4xl font-bold mb-8">Client Love</h2>
          <blockquote className="text-2xl italic text-gray-700 border-l-4 border-indigo-500 pl-6">
              The team handled our gala perfectly. Flawless execution and stunning results. Highly recommend!
          </blockquote>
          <p className="mt-4 text-lg font-semibold text-gray-500">— TechCorp CEO, 2025</p>
      </section>
      
    </div>
  );
}