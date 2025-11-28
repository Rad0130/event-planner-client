"use client";
import { useState } from "react";
import { X, Calendar, User, Mail, Phone, MessageSquare, Users, DollarSign } from "lucide-react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    _id: string;
    title: string;
    price: number;
    image: string;
  };
}

interface BookingFormData {
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventDate: string;
  guestCount: string;
  specialRequirements: string;
  budget: string;
}

export default function BookingModal({ isOpen, onClose, event }: BookingModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    eventId: event._id,
    eventTitle: event.title,
    userName: session?.user?.name || "",
    userEmail: session?.user?.email || "",
    userPhone: "",
    eventDate: "",
    guestCount: "",
    specialRequirements: "",
    budget: ""
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://event-planner-server-zsc1.onrender.com//bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await Swal.fire({
          title: 'Booking Request Sent!',
          text: `Your ${event.title} booking request has been submitted. We will contact you soon to confirm details.`,
          icon: 'success',
          confirmButtonColor: '#4f46e5',
          confirmButtonText: 'OK'
        });
        
        onClose();
        setFormData({
          eventId: event._id,
          eventTitle: event.title,
          userName: session?.user?.name || "",
          userEmail: session?.user?.email || "",
          userPhone: "",
          eventDate: "",
          guestCount: "",
          specialRequirements: "",
          budget: ""
        });
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to submit booking request. Please try again.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Event: {event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="userName"
                required
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="userEmail"
                required
                value={formData.userEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="userPhone"
                required
                value={formData.userPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="mr-2" />
                Preferred Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests *
              </label>
              <select
                name="guestCount"
                required
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="">Select guests</option>
                <option value="1-50">1-50 guests</option>
                <option value="51-100">51-100 guests</option>
                <option value="101-200">101-200 guests</option>
                <option value="201-500">201-500 guests</option>
                <option value="500+">500+ guests</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range *
              </label>
              <select
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="">Select budget</option>
                <option value="$500 - $1,000">$500 - $1,000</option>
                <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare size={16} className="mr-2" />
              Special Requirements
            </label>
            <textarea
              name="specialRequirements"
              rows={4}
              value={formData.specialRequirements}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              placeholder="Any special requirements, themes, or additional information..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? "Submitting..." : "Submit Booking Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}