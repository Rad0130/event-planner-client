"use client";
import { useEffect, useState, useCallback } from "react";
import { Trash2, Eye, Loader2, Edit } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Event {
  _id: string;
  title: string;
  price: number;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  shortDescription: string;
  image: string;
}

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
      if (res.ok) {
        const data: Event[] = await res.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
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
    if (!confirm("Are you sure you want to delete this event? This action is irreversible.")) return;
    
    setDeleteLoading(id);
    try {
      const res = await fetch(`${API_URL}/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter((e: Event) => e._id !== id));
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      alert("An error occurred during deletion.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600">Manage Events 🔐</h1>
        <Link 
          href="/dashboard/add-event"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
        >
          Add New Event
        </Link>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Events Found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first event.</p>
          <Link 
            href="/dashboard/add-event"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Add Your First Event
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-left">Event</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-left">Price</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-left">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-left">Priority</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{event.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-green-600 font-semibold">{formatCurrency(event.price)}</td>
                    <td className="p-4 text-gray-500">{event.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        event.priority === 'High' ? 'bg-red-100 text-red-700' :
                        event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {event.priority}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link 
                        href={`/events/${event._id}`} 
                        className="text-indigo-600 hover:text-indigo-800 transition inline-flex items-center"
                      >
                        <Eye size={18} className="mr-1" />
                        View
                      </Link>
                      <button 
                        onClick={() => handleDelete(event._id)} 
                        disabled={deleteLoading === event._id}
                        className="text-red-600 hover:text-red-800 transition inline-flex items-center disabled:opacity-50"
                      >
                        {deleteLoading === event._id ? (
                          <Loader2 size={18} className="animate-spin mr-1" />
                        ) : (
                          <Trash2 size={18} className="mr-1" />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {events.map((event) => (
              <div key={event._id} className="bg-white p-6 border rounded-xl shadow-md">
                <div className="flex items-start space-x-4 mb-4">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{event.shortDescription}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-semibold text-green-600">{formatCurrency(event.price)}</span>
                      <span className="text-gray-500">{event.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    event.priority === 'High' ? 'bg-red-100 text-red-700' :
                    event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {event.priority}
                  </span>
                  <div className="flex space-x-4">
                    <Link 
                      href={`/events/${event._id}`} 
                      className="text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <Eye size={20} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(event._id)} 
                      disabled={deleteLoading === event._id}
                      className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                    >
                      {deleteLoading === event._id ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}