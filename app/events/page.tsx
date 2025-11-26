import Link from "next/link";
import Image from "next/image";

// Disable caching
export const dynamic = "force-dynamic";

interface EventType {
  _id: string;
  EventName: string;
  Description: string;
  Price: number;
  Image: string;
}

async function getEvents(): Promise<EventType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
      <p className="text-gray-600 mb-8">Discover our curated list of exclusive events.</p>

      {/* Search Bar Placeholder */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full md:w-1/3 p-3 border rounded-lg focus:ring-2 ring-indigo-500 outline-none"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((event: EventType) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative h-48 w-full bg-gray-200">
              <img
                src={event.Image}
                alt={event.EventName}
                width={500}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1">{event.EventName}</h3>
              <p className="text-indigo-600 font-semibold mb-2">${event.Price}</p>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.Description}</p>

              <Link
                href={`/events/${event._id}`}
                className="block w-full text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}