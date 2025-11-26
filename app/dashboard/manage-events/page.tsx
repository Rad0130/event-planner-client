"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Trash2, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

// Assuming NEXT_PUBLIC_API_URL is available in the environment
const API_URL = process.env.NEXT_PUBLIC_API_URL; 

interface Event {
    _id: string;
    title: string;
    price: number;
    date: string;
    priority: 'High' | 'Medium' | 'Low';
}

export default function ManageEvents() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() { redirect("/login"); },
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
        const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
        const data: Event[] = await res.json();
        setEvents(data);
    } catch (error) {
        console.error("Failed to fetch events:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this event? This action is irreversible.")) return;
    
    try {
        const res = await fetch(`${API_URL}/events/${id}`, { method: "DELETE" });
        if(res.ok) {
            alert("Event Deleted Successfully!");
            // Optimistically update UI
            setEvents(events.filter((e: Event) => e._id !== id));
        } else {
            alert("Failed to delete event.");
        }
    } catch (error) {
        alert("An error occurred during deletion.");
    }
  };

  if (status === "loading" || loading) {
      return <div className="text-center py-20 text-indigo-600"><Loader2 className="animate-spin inline mr-2" /> Loading Events...</div>;
  }
  
  if (events.length === 0) {
      return (
          <div className="max-w-6xl mx-auto px-6 py-12 text-center">
              <h1 className="text-3xl font-bold mb-4">Manage Events 🔐</h1>
              <p className="text-gray-500">No events found in the database. <Link href="/dashboard/add-event" className="text-indigo-600 hover:underline">Add one now!</Link></p>
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-indigo-600">Manage Events 🔐</h1>
        
        {/* Responsive Table for Desktop/Tablet */}
        <div className="hidden md:block overflow-x-auto bg-white shadow-xl rounded-xl border">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Priority</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event._id} className="border-b hover:bg-indigo-50/50 transition">
                            <td className="p-4 font-medium">{event.title}</td>
                            <td className="p-4 text-green-600 font-semibold">{formatCurrency(event.price)}</td>
                            <td className="p-4 text-gray-500">{event.date}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                    event.priority === 'High' ? 'bg-red-100 text-red-700' :
                                    event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {event.priority}
                                </span>
                            </td>
                            <td className="p-4 text-right space-x-3">
                                <Link href={`/events/${event._id}`} className="text-indigo-600 hover:text-indigo-800 transition">
                                    <Eye size={18} className="inline" />
                                </Link>
                                <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-800 transition">
                                    <Trash2 size={18} className="inline" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Card Grid for Mobile */}
        <div className="md:hidden space-y-4">
            {events.map((event) => (
                <div key={event._id} className="bg-white p-4 border rounded-lg shadow-md">
                    <h3 className="text-lg font-bold truncate">{event.title}</h3>
                    <div className="mt-2 text-sm space-y-1">
                        <p className="font-semibold text-green-600">Price: {formatCurrency(event.price)}</p>
                        <p className="text-gray-600">Date: {event.date}</p>
                        <p className="font-medium">Priority: {event.priority}</p>
                    </div>
                    <div className="flex justify-end space-x-4 mt-4">
                        <Link href={`/events/${event._id}`} className="text-indigo-600 hover:text-indigo-800 transition">
                            <Eye size={20} />
                        </Link>
                        <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-800 transition">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>

    </div>
  );
}