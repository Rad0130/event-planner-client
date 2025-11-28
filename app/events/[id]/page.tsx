"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, DollarSign, Tag, Users } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import BookingModal from "@/components/BookingModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://event-planner-server-zsc1.onrender.com';

interface Event {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  image: string;
}

interface EventDetailsProps {
  params: {
    id: string;
  };
}

export default function EventDetails({ params }: EventDetailsProps) {
  const { id } = params; // FIXED: Removed use() hook
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${id}`);
        if (res.ok) {
          const eventData = await res.json();
          setEvent(eventData);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600">Event Not Found</h1>
        <p className="text-lg text-gray-600 mt-4">The event you are looking for does not exist.</p>
        <Link href="/events" className="text-indigo-600 mt-6 inline-flex items-center hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Event List
        </Link>
      </div>
    );
  }

  const priorityColor = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800',
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/events" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition mb-6 font-semibold">
          <ArrowLeft size={18} className="mr-2" /> Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="relative h-[400px] w-full bg-gray-200">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            <h1 className="absolute bottom-0 left-0 p-6 text-white text-4xl md:text-5xl font-extrabold">
              {event.title}
            </h1>
          </div>

          <div className="p-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-4">Full Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{event.fullDescription}</p>
            </div>

            <div className="md:col-span-1 space-y-6 border-l md:border-t-0 border-gray-200 pl-8 pt-8 md:pt-0">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">Event Details</h2>
              
              <div className="flex items-center space-x-3">
                <DollarSign size={20} className="text-green-500" />
                <span className="font-bold text-2xl">{formatCurrency(event.price)}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-indigo-500" />
                <span className="text-gray-700 font-medium">Date: {event.date}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Tag size={20} className="text-yellow-500" />
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  priorityColor[event.priority]
                )}>
                  Priority: {event.priority}
                </span>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-md flex items-center justify-center"
                >
                  <Users size={20} className="mr-2" />
                  Book This Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        event={event}
      />
    </>
  );
}